var simulation;
var node, edge, label, label_background;

var spacing;

function render_topo() {

    d3.json("data/" + file + "/circuits/step-" + step + ".json").then(function (topo_raw) {

        //fix topo file data format
        topo = {
            nodes: [],
            edges: []
        }

        if (tree[step].children[0].label[1] !== "skip") {
            topo.edges.push({
                source: tree[step].children[0].label[1][0].replace("-right", "").replace("-left", ""),
                target: tree[step].children[0].label[1][1].replace("-right", "").replace("-left", ""),
                dist: $("#topo").width() * 0.5,
                style: "dashed"
            })
        }

        let check_dup_list = [];
        topo_raw["list of edges"].forEach(function (d) {
            check_dup_list.push(d[0]);
            check_dup_list.push(d[1]);
        })

        check_dup_list = check_dup_list.filter((a, i, aa) => aa.indexOf(a) === i && aa.lastIndexOf(a) !== i);

        topo_raw["list of edges"].forEach(function (d) {

            if ((isNaN(d[0]) || check_dup_list.includes(d[0])) && (isNaN(d[1]) || check_dup_list.includes(d[1]))) {
                topo.edges.push({
                    source: d[0].toString(),
                    target: d[1].toString(),
                    dist: $("#topo").width() * 0.1,
                    style: "solid"
                })
            }

        })

        topo_raw["list of nodes"].forEach(function (d) {
            if (isNaN(d) || check_dup_list.includes(d)) {
                topo.nodes.push({
                    id: d.toString(),
                    type: isNaN(d) ? "component" : "connector"
                })
            };
        })

        //re-render everytime screen rescales
        document.getElementById("topo").innerHTML = "";

        if ($("#topo").width() > 10) {

            topo_vis = d3.select("#topo")
                .append("svg")
                .attr("width", $("#topo").width())
                .attr("height", $("#topo").height());

            spacing = $("#topo").width() * -0.8;

            simulation = d3.forceSimulation(topo.nodes)
                .force('link', d3.forceLink(topo.edges).id(d => d.id).distance(d => d.dist))
                .force("charge", d3.forceManyBody().strength(spacing))
                .force('center', d3.forceCenter($("#topo").width() * 0.5, $("#topo").height() * 0.5))
                .force("x", d3.forceX())
                .force("y", d3.forceY())
                .on('tick', tick);

            //draw lines for the links 
            edge = topo_vis.append("g")
                .selectAll(".topo_edge")
                .data(topo.edges)
                .enter()
                .append("line")
                .attr("class", function (d) {
                    return "topo_edge " + d.style;
                })

            //draw circles for the nodes 
            node = topo_vis.append("g")
                .selectAll("circle")
                .data(topo.nodes)
                .enter()
                .append("circle")
                .attr("data-name", function (d) {
                    return d.id;
                })
                .attr("r", function (d) {
                    return d.type === "component" ? 5 : 1;
                })
                .style("fill", "var(--main)");

            label_background = topo_vis.append("g")
                .selectAll(".label_background")
                .data(topo.nodes)
                .enter()
                .append("rect")
                .attr("class", "label_background")

            label = topo_vis.append("g")
                .selectAll(".label")
                .data(topo.nodes)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("data-name", function (d) {
                    return d.id;
                })
                .attr("id", function (d) {
                    return "topotext" + d.id;
                })
                .text(function (d) {
                    return d.id;
                })
                .style("font-size", function (d) {
                    return isNaN(d.id) ? "14px" : "10px";
                })
                .attr("transform", function (d) {
                    return isNaN(d.id) ?
                        "translate(0,-20)" :
                        "translate(0,-10)";
                })

            label_background
                .data(topo.nodes)
                .attr("width", function (d) {
                    return d3.select("#topotext" + d.id).node().getBBox().width + 10;
                })
                .attr("height", function (d) {
                    return d3.select("#topotext" + d.id).node().getBBox().height + 6;
                })
                .attr("transform", function (d) {
                    return isNaN(d.id) ?
                        "translate(" + (d3.select("#topotext" + d.id).node().getBBox().width * -0.5 - 5) + ", " + (d3.select("#topotext" + d.id).node().getBBox().height * -0.5 - 25) + ")" :
                        "translate(" + (d3.select("#topotext" + d.id).node().getBBox().width * -0.5 - 5) + ", " + (d3.select("#topotext" + d.id).node().getBBox().height * -0.5 - 15) + ")";
                })

            drag_handler = d3.drag()
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end);

            drag_handler(node);

            function drag_start(event, d) {
                if (!event.active) simulation.alphaTarget(0.5).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function drag_drag(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function drag_end(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            highlight_topo();
        };
    });
}

function tick() {

    //    if (simulation.alpha() - simulation.alphaMin() < 0.5) {

    node
        .attr("cx", function (d) {
            return d.x = Math.max(topo_margin, Math.min($("#topo").width() - topo_margin, d.x));
        })
        .attr("cy", function (d) {
            return d.y = Math.max(topo_margin, Math.min($("#topo").height() - topo_margin, d.y));
        });

    edge
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    label
        .attr("x", function (d) {
            return d.x = Math.max(topo_margin, Math.min($("#topo").width() - topo_margin, d.x));
        })
        .attr("y", function (d) {
            return d.y = Math.max(topo_margin, Math.min($("#topo").height() - topo_margin, d.y));
        })

    label_background
        .attr("x", function (d) {
            return d.x = Math.max(topo_margin, Math.min($("#topo").width() - topo_margin, d.x));
        })
        .attr("y", function (d) {
            return d.y = Math.max(topo_margin, Math.min($("#topo").height() - topo_margin, d.y));
        })

    //    };
};

function highlight_topo() {

    let labels = tree[step].children[0].label[1];
    d3.selectAll(".highlight").attr("class", "");

    if (document.querySelectorAll("[data-name='" + labels[0].replace("-right", "").replace("-left", "") + "']").length !== 0) {
        document.querySelectorAll("[data-name='" + labels[0].replace("-right", "").replace("-left", "") + "']").forEach(function (d) {
            d.classList.add("highlight");
        })
    };

    if (document.querySelectorAll("[data-name='" + labels[1].replace("-right", "").replace("-left", "") + "']").length !== 0) {
        document.querySelectorAll("[data-name='" + labels[1].replace("-right", "").replace("-left", "") + "']").forEach(function (d) {
            d.classList.add("highlight");
        })
    };
}
