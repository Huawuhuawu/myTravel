document.getElementById("confirm-button").addEventListener("click", async () => {
    const text = document.getElementById("summary-attractions").textContent;
    const match = text.match(/Number of attractions:\s*(\d+)/);
    const total_to_include = match ? parseInt(match[1], 10) : 0;

    const excludeText = document.getElementById("exclude-input").value;
    const exclude_indices = excludeText.split(',').map(num => parseInt(num.trim()));

    const way_to_move = document.getElementById("way-to-move").value;

    const payload = {
      total_to_include: total_to_include,
      exclude_indices: exclude_indices,
      way_to_move: way_to_move
    };

    const response = await fetch("/run-python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const resultHtml = await response.text();
    document.querySelector(".display-content").innerHTML = resultHtml;
  });