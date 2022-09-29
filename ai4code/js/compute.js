var step = 0,
    current_layer;

var x_range = [],
    position_offset = 10;

var topo,
    tree,
    labels;

var topo_margin = 20,
    tree_margin = 20;

var tree_vis = d3.select("#tree").append("svg"),
    topo_vis = d3.select("#topo").append("svg"),
    test_width = d3.select("body").append("svg").append("text").attr("id", "test_width");

var auto_render,
    render_speed = 2000;

var file = 1;

function compute() {

    clearInterval(auto_render);

    //load local static data (potentially later to be substitute with jupyter data)
    //d3.json("data/v2/topo.json").then(function (topo_raw) {
    d3.json("data/" + file + "/tree.json").then(function (tree_raw) {

        // setting the top of the decision tree
        tree = [];
        labels = [];
        current_layer = tree_raw;

        while (current_layer !== undefined && current_layer.children.length !== 0) {
            tree.push(current_layer);
            // taking the largest possible result
            current_layer = current_layer.children
                .sort((a, b) => +b.score - +a.score)[0];

            labels.push(current_layer.label[1]);
            //.filter((a) => a.score !== 0)[0]
        };

        //append steps and deduce position
        tree.forEach(function (d, a) {

            let position = position_offset;

            d.children.forEach(function (e, i) {

                test_width.text(function () {
                        if (i == 0) {
                            if (e.label[1] == "skip") {
                                return "NA";
                            } else {
                                return e.label[1].join(" <-> ");
                            }
                        } else {
                            return e.score == 0 ? 0 : expo(e.score, 2);
                        }
                    })
                    .style("font-size", function () {
                        if (i == 0) {
                            return "14px";
                        } else {
                            return "10px";
                        }
                    })

                //console.log(d3.select("#test_width").node().getBBox().width);
                if (i == 0) {
                    e.position = 0;
                } else {
                    e.position = position;
                }

                //position += e.score + position_offset;
                position += d3.select("#test_width").node().getBBox().width + position_offset;

                x_range.push(position);
            })

            $("#progress").append(`<button id="pro${a}" style="width: ${100/tree.length}%" onclick="render_clear_interval(${a})"><span>${(a+1)}</span></button>`)
        });

        x_range = d3.max(x_range);

        treeY = d3.scaleLinear()
            .domain([0, tree.length]);
        treeX = d3.scaleLinear()
            .domain([0, x_range]);

        //append visualizations, starting with step 0;
        go_to_step();

        d3.json("data/" + file + "/circuits/step-" + (tree.length - 1) + ".json").then(function (d) {
            document.getElementById("circuit_stats").innerHTML = `Efficiency: ${d.efficiency.toFixed(3)} | Voltage Output: ${d["voltage output"].toFixed(1)}V`

        });

        //         <p id="circuit_stats">Efficiency: - | Voltage Output: -</p>

        auto_render = setInterval(function () {
            step++;
            go_to_step();
        }, render_speed);

    });
};

function go_to_step() {

    if (step >= tree.length - 1) {
        clearInterval(auto_render);
    }

    document.querySelectorAll("#progress button").forEach(function (d, i) {
        if (i <= step) {
            d.className = "active";
        } else {
            d.className = "";
        }
    })
    render_tree();
}

function expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
}

function render_clear_interval(n) {
    step = n;
    clearInterval(auto_render);
    go_to_step();
}

function replay() {
    clearInterval(auto_render);
    step = 0;
    go_to_step();
    auto_render = setInterval(function () {
        step++;
        go_to_step();
    }, render_speed);
}

function rescale_window() {
    go_to_step();
}


function generate() {

    let random_num = file + 1 - 1;
    while (random_num == file) {
        file = 1 + Math.floor(Math.random() * 3);
        console.log("selected file " + file);
    }

    step = 0;
    x_range = [];
    document.getElementById("progress").innerHTML = `<i class="fa fa-play-circle" onClick="replay()"></i>`;

    compute();
}
