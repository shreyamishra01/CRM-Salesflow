<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chart.js Example</title>
  <!-- Load Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h3>Revenue Overview</h3>
  <canvas id="myChart" width="400" height="200"></canvas>

  <script>
    const ctx = document.getElementById('myChart').getContext('2d');

    new Chart(ctx, {
      type: 'line', // can be 'bar', 'pie', 'doughnut', etc.
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 42000],
            borderColor: '#4361ee',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Expenses',
            data: [8000, 12000, 10000, 15000, 13000, 18000],
            borderColor: '#e63946',
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            tension: 0.3,
            fill: true,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => '$' + value.toLocaleString()
            }
          }
        }
      }
    });
  </script>
</body>
</html>
