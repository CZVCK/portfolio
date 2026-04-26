async function loadChart() {
  const res = await fetch('/api/speedtest');
  const data = await res.json();
// date labels
  const labels = data.map(r => {
    const d = new Date(r.timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  });
// prevents duplicate charts
  const existing = Chart.getChart('speedChart');
  if (existing) existing.destroy();

  new Chart(document.getElementById('speedChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Download (Mbps)',
          data: data.map(r => r.download_mbps),
          borderColor: '#00ff99',
          backgroundColor: 'rgba(0, 255, 153, 0.05)',
          tension: 0.25,
          pointRadius: 0
        },
        {
          label: 'Upload (Mbps)',
          data: data.map(r => r.upload_mbps),
          borderColor: '#00aaff',
          backgroundColor: 'rgba(0, 170, 255, 0.05)',
          tension: 0.25,
          pointRadius: 0
        },
        {
          label: 'Ping (ms)',
          data: data.map(r => r.ping_ms),
          borderColor: '#ff6666',
          backgroundColor: 'rgba(255, 102, 102, 0.05)',
          tension: 0.25,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#ccc', boxWidth: 12 } }
      },
      scales: {
        x: {
          ticks: { color: '#888', maxRotation: 45, maxTicksLimit: 8 },
          grid: { color: 'rgba(255,255,255,0.05)' }
        },
        y: {
          ticks: { color: '#888' },
          grid: { color: 'rgba(255,255,255,0.05)' }
        }
      }
    }
  });
}

loadChart();
setInterval(loadChart, 15 * 60 * 1000);
