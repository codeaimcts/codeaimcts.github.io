var file = "Circle",
    file_options = ["A+B", "Circle", "Dont_be_late"];

var step = 0,
    current_layer;

var x_range = [],
    position_offset = 30;

var tree;

var topo_margin = 20,
    tree_margin = 20,
    treeX,
    treeY;

var tree_vis = d3.select("#tree").append("svg"),
    topo_vis = d3.select("#topo").append("svg"),
    test_width = d3.select("body").append("svg").append("text").attr("id", "test_width");

var auto_render,
    render_speed = 500;

function compute() {

    clearInterval(auto_render);

    d3.json("./data/" + file + "/metadata.json").then(function (metadata_raw) {
        d3.json("./data/" + file + "/solution.json").then(function (solution_raw) {
            d3.json("./data/" + file + "/tree.json").then(function (tree_raw) {

//                                console.log(metadata_raw);
//                                console.log(solution_raw);
                //                console.log(tree_raw);

                tree = tree_raw;

                let x_range = [];

                //append steps and deduce position
                tree.forEach(function (d, a) {

                    let position = position_offset;

                    d = d.sort((a, b) =>
                        d3.descending(a.selected, b.selected));

                    d.forEach(function (e, i) {

                        e.token = e.token.replace(/\n/g, "[break]");
                        e.token = e.token.replace(/\t/g, "[tab]");
                        if(e.token == " "){ e.token = "[space]"}

                        test_width.html(function () {
                                if (i == 0) {
                                    return e.score == 0 ? 0 : expo(e.score, 2);
                                } else {
                                    return e.score == 0 ? e.token + "<tspan dx='3'>(0)</tspan>" : e.score >= 1 ? e.token + "<tspan dx='3'>(" + e.score + ")</tspan>" : e.token + "<tspan dx='3'>(" + expo(e.score, 1) + ")</tspan>";
                                }
                            })
                            .style("font-size", "16px")

                        //console.log(d3.select("#test_width").node().getBBox().width);
                        if (i == 0) {
                            e.position = 0;
                        } else {
                            e.position = position + 5;
                        }

                        //position += e.score + position_offset;
                        position += d3.select("#test_width").node().getBBox().width + position_offset;

                        x_range.push(position);
                    })

                    $("#progress").append(`<button id="pro${a}" style="width: ${100/tree.length}%" onclick="render_clear_interval(${a})"><span>${(a+1)}</span></button>`)
                });

                treeY = d3.scaleLinear()
                    .domain([0, tree.length]);
                treeX = d3.scaleLinear()
                    .domain([0, d3.max(x_range)]);

                //re-render everytime screen rescales
                document.getElementById("tree").innerHTML = "";

                tree_vis = d3.select("#tree")
                    .append("svg")
                    .attr("id", "tree_svg")
                    .attr("width", $("#tree").width())
                    .attr("height", function () {
                        if ($("#tree").height() > 70 * tree.length) {
                            return $("#tree").height();
                        } else {
                            return 70 * tree.length;
                        }
                    });

                treeX.range([tree_margin, $("#tree_svg").width()]);
                treeY.range([tree_margin, $("#tree_svg").height() - tree_margin]);


                // append relevant metadata
                document.getElementById("example_name").innerHTML = file;
                document.getElementById("example_difficulty").innerHTML = `(Difficulty: ${metadata_raw.difficulty})`;
                document.getElementById("example_question").innerHTML = question_data[file]["Description"];
                document.getElementById("example_logic").innerHTML = `
                        <div><h4>Constraints</h4>
                            ${question_data[file]["Constraints"].length == 0 ? "<p>none</p>" : "<ul><li>" + question_data[file]["Constraints"].join("</li><li>") + "</li></ul>"}
                        </div>
                        <div><h4>Input</h4>
                            <p>${question_data[file]["Input"]}</p>
                        </div>
                        <div><h4>Output</h4>
                            <p>${question_data[file]["Output"]}</p>
                        </div>
                    `;
                document.getElementById("solution_stats").innerHTML = `
                        Samples: ${solution_raw["sample times"]} | Computation Time: ${solution_raw["time"].toFixed(2)} sec.
                    `
                
                let examples = "";
                question_data[file]["Examples"].forEach(function(d){
                    examples += `
                    <tr>
                        <td>${d["Input"]}</td>
                        <td>${d["Output"]}</td>
                        <td>Yes</td>
                    </tr>`
                })
                document.getElementById("evaluation").innerHTML = `
                <tr>
                    <th>Input</th>
                    <th>Output</th>
                    <th>Passed?</th>
                </tr>
                ${examples}`;

                go_to_step();

                auto_render = setInterval(function () {
                    step++;
                    go_to_step();
                }, render_speed);

            });
        });
    });
}

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
    //re-render everytime screen rescales
    document.getElementById("tree").innerHTML = "";

    tree_vis = d3.select("#tree")
        .append("svg")
        .attr("id", "tree_svg")
        .attr("width", $("#tree").width())
        .attr("height", function () {
            if ($("#tree").height() > 50 * tree.length) {
                return $("#tree").height();
            } else {
                return 50 * tree.length;
            }
        });

    treeX.range([tree_margin, $("#tree_svg").width() - tree_margin]);
    treeY.range([tree_margin, $("#tree_svg").height() - tree_margin]);

    go_to_step();
}


function new_example() {

    let random_num = file + "";
    while (random_num == file) {
        file = file_options[Math.floor(Math.random() * 3)];
        console.log("selected file " + file);
    }

    step = 0;
    x_range = [];
    document.getElementById("progress").innerHTML = `<i class="fa fa-play-circle" onClick="replay()"></i>`;

    compute();
}
