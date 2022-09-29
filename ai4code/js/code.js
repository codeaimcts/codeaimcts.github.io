function code_update(code){
    document.getElementById("code_update").innerHTML = code.state.replace(/\t/g, "&nbsp&nbsp&nbsp");
    document.getElementById("code_status").innerHTML = `
        <div>
            <h4>Status</h4>
            <p>${code.state == code.complete_program ? "complete" : "in-process"}</p>
        </div>
        <div>
            <h4>Current Token</h4>
            <p><span class="code_token">${code.token}</span> score: ${code.score}</p>
        </div>
        `
    hljs.highlightAll();
}