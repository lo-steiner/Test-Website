/**
 * Chart.js Controller - Zerstört alte Instanzen sauber und baut Diagramme dynamisch auf
 */

const ChartEngine = {
  instances: {},

  // Formatiert große Zahlen lesbar (z.B. 1.2M, 450K)
  formatNumber(val) {
    if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
    return val;
  },

  destroyChart(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  // 1. Multi-Line Growth Chart
  renderGrowthChart(canvasId, historyData) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: historyData.labels,
        datasets: [
          {
            label: 'YouTube',
            data: historyData.youtube,
            borderColor: '#ff334b',
            backgroundColor: 'rgba(255, 51, 75, 0.1)',
            tension: 0.35,
            fill: true
          },
          {
            label: 'TikTok',
            data: historyData.tiktok,
            borderColor: '#00f2fe',
            backgroundColor: 'rgba(0, 242, 254, 0.1)',
            tension: 0.35,
            fill: true
          },
          {
            label: 'Instagram',
            data: historyData.instagram,
            borderColor: '#fa7e1e',
            backgroundColor: 'rgba(250, 126, 30, 0.1)',
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: '#94a3b8' } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${this.formatNumber(ctx.raw)}`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#94a3b8',
              callback: (val) => this.formatNumber(val)
            }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  },

  // 2. Audience Share Donut Chart
  renderDistributionChart(canvasId, platforms) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['YouTube', 'TikTok', 'Instagram'],
        datasets: [{
          data: [platforms.youtube.followers, platforms.tiktok.followers, platforms.instagram.followers],
          backgroundColor: ['#ff334b', '#00f2fe', '#fa7e1e'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } }
        }
      }
    });
  },

  // 3. Engagement Radar Chart
  renderRadarChart(canvasId, platforms) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Engagement %', 'Follower Share', 'Content Frequency', 'Reach Index', 'Conversion'],
        datasets: [
          {
            label: 'Performance Index',
            data: [
              platforms.youtube.engagement * 10,
              75,
              platforms.tiktok.posts > 100 ? 90 : 50,
              85,
              70
            ],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.08)' },
            pointLabels: { color: '#94a3b8', font: { size: 11 } },
            ticks: { display: false }
          }
        }
      }
    });
  }
};