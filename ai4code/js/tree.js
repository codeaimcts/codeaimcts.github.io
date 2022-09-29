var treeX,
    treeY;

var layer;

var tree_link = d3.linkVertical()
    .source(function (d) {
        return [treeX(0), treeY(layer)];
    })
    .target(function (d) {
        return [treeX(d.position) - 0.01, treeY(layer + 1) - 30];
    });

function render_tree() {

    document.getElementById("tree_svg").innerHTML = "";

    tree.forEach(function (decision, i) {

        if (i <= step) {

            layer = i;

            tree_vis.selectAll(".path" + i)
                .data(decision)
                .join("path")
                .attr("class", "tree_path path" + i)
                .attr("d", tree_link)
                .style("stroke", function (d, a) {
                    if (a == 0 && i == step) {
                        return "var(--highlight)";
                    } else {
                        return "var(--main)";
                    };
                })
                .style("opacity", function (d, a) {
                    if (a == 0 || i == step) {
                        return 1;
                    } else if (d.score > 0) {
                        return 0.5;
                    } else {
                        return 0.1;
                    };
                })


            tree_vis.selectAll(".tree_pointer" + i)
                .data(decision)
                .enter()
                .append("path")
                .attr("class", "tree_pointer tree_pointer" + i)
                .attr("d", d3.symbol()
                    .type(d3.symbolTriangle)
                    .size(30))
                .attr("transform", function (d) {
                    return "translate(" + treeX(d.position) + ", " + (treeY(layer + 1) - 28) + ") rotate(180)";
                })
                .style("fill", function (d, a) {
                    if (a == 0 && i == step) {
                        return "var(--highlight)";
                    } else {
                        return "var(--main)";
                    };
                })
                .style("opacity", function (d, a) {
                    if (a == 0 || i == step) {
                        return 1;
                    } else if (d.score > 0) {
                        return 0.5;
                    } else {
                        return 0.1;
                    };
                })


            tree_vis.selectAll(".tree_score" + i)
                .data(decision)
                .enter()
                .append("rect")
                .attr("class", "tree_score tree_score" + i)
                .attr("x", function (d, a) {
                    return a == 0 ? treeX(d.position) - 4 : treeX(d.position) - 8;
                })
                .attr("y", function (d) {
                    return treeY(layer + 1) - 23;
                })
                .attr("height", 26)
                .style("fill", function (d, a) {
                    if (a == 0 && i == step) {
                        return "var(--highlight)";
                    } else {
                        return "var(--main)";
                    };
                })
                .style("opacity", function (d, a) {
                    if (a == 0 || i == step) {
                        return 1;
                    } else if (d.score > 0) {
                        return 0.5;
                    } else {
                        return 0;
                    };
                })

            tree_vis.append("text")
                .attr("x", treeX(decision[0].position) + 2)
                .attr("y", treeY(layer + 1) - 5)
                .attr("id", "tree_text" + i)
                .text(function () {
                    return decision.filter(function (d) {
                        return d.selected == true;
                    })[0].token;
                })
                .style("font-size", 16)
                .style("fill", "var(--background)");

            let tree_text = tree_vis.selectAll(".tree_score_text" + i)
                .data(decision)
                .enter()
                .append("text")
                .attr("id", function (d, a) {
                    return "text_score" + i + "_" + a;
                })
                .attr("class", function(d,a){
                    if (a == 0) {
                        return "tree_score_text_small tree_score_text" + i
                    } else {
                        return "tree_score_text tree_score_text" + i
                    }
                    
                })
                .attr("x", function (d, a) {
                    return a == 0 ? treeX(d.position) + 7 : treeX(d.position) - 1;
                })
                .attr("y", function (d, a) {
                    return a == 0 ? treeY(layer + 1) - 27 : treeY(layer + 1) - 5;
                })
                .html(function (d, a) {
                    if (a == 0) {
                        return d.score == 0 ? 0 : expo(d.score, 2);
                    } else {
                        return d.score == 0 ? d.token + "<tspan dx='3'>(0)</tspan>" : d.score >= 1 ? d.token + "<tspan dx='3'>(" + d.score + ")</tspan>" : d.token + "<tspan dx='3'>(" + expo(d.score, 1) + ")</tspan>";
                    }
                })
                .style("fill", function (d, a) {
                    if (a == 0 && i == step) {
                        return "var(--highlight)";
                    } else if (a == 0) {
                        return "var(--main)";
                    } else if (d.score > 0 || i == step) {
                        return "var(--background)";
                    } else {
                        return "var(--gray)";
                    };
                })


            tree_vis.selectAll(".tree_score" + i)
                .data(decision)
                .attr("width", function (d, a) {
                    if (a == 0) {
                        return d3.max([treeX(d.position + d.score + position_offset / 2) - treeX(d.position), d3.select("#tree_text" + i).node().getBBox().width + 14]);
                    } else if (d.score == 0) {
                        return d3.select("#text_score" + i + "_" + a).node().getBBox().width + 14;
                    } else {
                        return d3.max([treeX(d.position + d.score + position_offset / 2) - treeX(d.position), d3.select("#text_score" + i + "_" + a).node().getBBox().width + 14]);
                    };
                })
            
            if( i == step) {
                code_update(decision[0]);
            }

        };
    });
}
