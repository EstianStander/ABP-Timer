document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data from the server
    const response = await fetch("/data");
    const { quadrants } = await response.json();

    // Get the container element
    const container = document.querySelector(".quadrant-container");

    // Loop through each bay and create a div for each
    quadrants.forEach((quadrant, index) => {
        const div = document.createElement("div");
        div.className = "quadrant";
        div.innerHTML = `
            <h2>Bay ${index + 1}</h2>
            <p>Project Name: ${quadrant.projectName || "No Project"}</p>
            <p>Assigned to: ${quadrant.assignedPerson || "N/A"}</p>
            <p id="timer-${index}" class="timer"></p>
            <ul>
                ${quadrant.tasks.map(task => `
                    <li>
                        ${task.text} 
                        (Deadline: ${new Date(task.deadline).toLocaleString()})
                    </li>
                `).join("")}
            </ul>
        `;
        container.appendChild(div);

        // Add click event to make the quadrant fullscreen
        div.addEventListener("click", () => {
            document.querySelectorAll('.quadrant').forEach(q => q.classList.remove('fullscreen'));
            div.classList.add('fullscreen');
        });

        // Function to update the countdown timer
        const updateTimer = () => {
            const now = new Date();
            const deadline = new Date(quadrant.timer);
            const diff = deadline - now;

            if (diff <= 0) {
                document.getElementById(`timer-${index}`).innerText = "Time's up!";
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                document.getElementById(`timer-${index}`).innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        };

        // Initial call to update the timer and set interval for real-time updates
        updateTimer();
        setInterval(updateTimer, 1000);
    });
});
