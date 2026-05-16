document.addEventListener('DOMContentLoaded', function() {

  async function loadChart() {
    const footer = document.querySelector('.card-footer .updated');
    try {
      const res = await fetch('/api/speedtest');
      if (!res.ok) throw new Error('non-200');
      const data = await res.json();
      const labels = data.map(r => {
        const d = new Date(r.timestamp);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      });
      const existing = Chart.getChart('speedChart');
      if (existing) existing.destroy();

      const style = getComputedStyle(document.documentElement);
      const colorTeal   = style.getPropertyValue('--teal').trim();
      const colorUpload = style.getPropertyValue('--chart-upload').trim();
      const colorPing   = style.getPropertyValue('--chart-ping').trim();
      const colorMuted  = style.getPropertyValue('--muted').trim();
      const colorText   = style.getPropertyValue('--text').trim();

      new Chart(document.getElementById('speedChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Download (Mbps)',
              data: data.map(r => r.download_mbps),
              borderColor: colorTeal,
              backgroundColor: colorTeal + '14',
              tension: 0.25,
              pointRadius: 0
            },
            {
              label: 'Upload (Mbps)',
              data: data.map(r => r.upload_mbps),
              borderColor: colorUpload,
              backgroundColor: colorUpload + '14',
              tension: 0.25,
              pointRadius: 0
            },
            {
              label: 'Ping (ms)',
              data: data.map(r => r.ping_ms),
              borderColor: colorPing,
              backgroundColor: colorPing + '0d',
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
            legend: { labels: { color: colorText, boxWidth: 12 } }
          },
          scales: {
            x: {
              ticks: { color: colorMuted, maxRotation: 45, maxTicksLimit: 8 },
              grid: { color: 'rgba(255,255,255,0.05)' }
            },
            y: {
              ticks: { color: colorMuted },
              grid: { color: 'rgba(255,255,255,0.05)' }
            }
          }
        }
      });
    } catch (err) {
      if (footer) footer.textContent = 'data unavailable — server offline';
    }
  }

  loadChart();
  setInterval(loadChart, 15 * 60 * 1000);

  document.getElementById('contact-submit').addEventListener('click', async () => {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const website = document.getElementById('contact-website').value;
    const status = document.getElementById('contact-status');
    const button = document.getElementById('contact-submit');

    if (!name || !email || !message) {
      status.textContent = '[ERROR] all fields required.';
      status.className = 'contact-status error';
      return;
    }

    button.disabled = true;
    button.textContent = 'sending...';

    try {
      const response = await fetch('https://work.czvck.com/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website })
      });

      const data = await response.json();

      if (data.success) {
        status.textContent = '[SUCCESS] message transmitted.';
        status.className = 'contact-status success';
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-message').value = '';
      } else {
        status.textContent = data.error || '[ERROR] transmission failed.';
        status.className = 'contact-status error';
      }
    } catch (err) {
      status.textContent = '[OFFLINE] could not reach server. try again later.';
      status.className = 'contact-status error';
    } finally {
      button.disabled = false;
      button.textContent = 'send message';
    }
  });

}); // end DOMContentLoaded