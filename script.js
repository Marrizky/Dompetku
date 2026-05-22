/**
 * DOMPETKU PREMIUM FINTECH CLASSIC WIDGET
 * Pure vanilla JavaScript implementations for GitHub Pages / static hosting.
 */

// Global active instances & state
let transactions = [];
let userDisplayName = '';
let userMonthlyBudget = 1500000; // Default Rp 1.500.000
let activeTypeSelection = 'expense'; // Default form choice
let transactionIdToDelete = null; // Stored transaction node for deletion confirmation

// Charts cache references
let chartPie = null;
let chartArea = null;

// ==========================================
// 🌟 APP INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Sync state from localStorage
  loadStateFromStorage();
  
  // Set up Live Clock
  startLiveClock();

  // Attach DOM Event Listeners
  setupEventListeners();

  // Draw or hide app based on session
  renderAuthRoute();
});

// ==========================================
// 🔐 AUTHENTICATION & ROUTING
// ==========================================
function renderAuthRoute() {
  const loginSection = document.getElementById('login-section');
  const appSection = document.getElementById('app-section');
  const userGreeting = document.getElementById('user-display-greeting');

  if (userDisplayName && userDisplayName.trim() !== '') {
    // Logged In
    loginSection?.classList.add('hidden');
    
    if (appSection) {
      if (appSection.classList.contains('hidden')) {
        appSection.classList.remove('hidden');
        appSection.classList.add('animate-premium-fade');
      }
    }
    
    if (userGreeting) {
      userGreeting.textContent = `Halo, ${userDisplayName}! 👋`;
    }
    
    // Core updates
    recalculateDashboard();
  } else {
    // Logged Out / Guest Mode
    loginSection?.classList.remove('hidden');
    
    if (appSection) {
      appSection.classList.add('hidden');
      appSection.classList.remove('animate-premium-fade');
    }
    
    // Sync the current theme icons
    syncThemeIcons();
  }
}

// Load transactions specifically for a logged-in user with legacy fallback
function loadTransactionsForUser(username) {
  if (!username) {
    transactions = [];
    return;
  }

  const savedTransactions = localStorage.getItem(`dompetku_transactions_${username}`);
  if (savedTransactions) {
    try {
      transactions = JSON.parse(savedTransactions);
    } catch (e) {
      transactions = [];
    }
  } else {
    // Fallback: check if old general key has valid user data
    const oldTransactionsStr = localStorage.getItem('dompetku_transactions');
    if (oldTransactionsStr) {
      try {
        const parsed = JSON.parse(oldTransactionsStr);
        const isDemoData = parsed.some(tx => tx.id && tx.id.startsWith('tx_mock_'));
        
        if (!isDemoData && username !== 'Rizky Mahesa (Demo)') {
          // Transfer real user data from legacy key to scoped key
          transactions = parsed;
          localStorage.setItem(`dompetku_transactions_${username}`, JSON.stringify(transactions));
        } else {
          transactions = [];
        }
      } catch (e) {
        transactions = [];
      }
    } else {
      transactions = [];
    }
  }
}

// Save basic credentials to Local Storage
function setSession(username) {
  userDisplayName = username;
  localStorage.setItem('dompetku_user_name', username);
  
  // Scoped transactions loading during login
  loadTransactionsForUser(username);
  
  renderAuthRoute();
}

// Log Out & reset view state
function logout() {
  const logoutModal = document.getElementById('logout-confirmation-modal');
  logoutModal?.classList.remove('hidden');
}

// ==========================================
// 💾 STATE STORAGE & MOCK GENERATION
// ==========================================
function loadStateFromStorage() {
  const savedName = localStorage.getItem('dompetku_user_name');
  const savedBudget = localStorage.getItem('dompetku_user_budget');
  const savedTheme = localStorage.getItem('dompetku_theme');

  if (savedName) {
    userDisplayName = savedName;
    loadTransactionsForUser(savedName);
  } else {
    userDisplayName = '';
    transactions = [];
  }
  
  if (savedBudget) userMonthlyBudget = parseFloat(savedBudget);

  // Handle Theme Preference
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
  syncThemeIcons();
}

function saveTransactionsToStorage() {
  if (userDisplayName) {
    localStorage.setItem(`dompetku_transactions_${userDisplayName}`, JSON.stringify(transactions));
  } else {
    localStorage.setItem('dompetku_transactions', JSON.stringify(transactions));
  }
}

// Beautiful Realistic Mock Data Generator for Seminar Vibes
function loadDemoMockData() {
  const today = new Date();
  
  // Get string date representations relative to today
  const getDateOffset = (offsetDays) => {
    const d = new Date();
    d.setDate(today.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  };

  const mockTransactions = [
    {
      id: 'tx_mock_1',
      type: 'income',
      amount: 2500000,
      category: 'Lainnya',
      date: getDateOffset(18),
      notes: 'Kiriman Uang Bulanan Ortu 👨‍👩‍👦'
    },
    {
      id: 'tx_mock_2',
      type: 'income',
      amount: 800000,
      category: 'Lainnya',
      date: getDateOffset(14),
      notes: 'Gaji Freelance Desain Logo Startup 🎨'
    },
    {
      id: 'tx_mock_3',
      type: 'expense',
      amount: 15000,
      category: 'Pendidikan',
      date: getDateOffset(12),
      notes: 'Print Tugas Laporan Akhir 📄'
    },
    {
      id: 'tx_mock_4',
      type: 'expense',
      amount: 45000,
      category: 'Makanan',
      date: getDateOffset(10),
      notes: 'Jajan Mie Gacoan Level 4 🍜'
    },
    {
      id: 'tx_mock_5',
      type: 'expense',
      amount: 50000,
      category: 'Transportasi',
      date: getDateOffset(8),
      notes: 'Isi Pertamax Bulanan Motor 🚗'
    },
    {
      id: 'tx_mock_6',
      type: 'expense',
      amount: 320000,
      category: 'Pendidikan',
      date: getDateOffset(7),
      notes: 'Buku Kuliah Semester Baru 🎓'
    },
    {
      id: 'tx_mock_7',
      type: 'expense',
      amount: 75000,
      category: 'Hiburan',
      date: getDateOffset(6),
      notes: 'Nonton Bioskop Spiderman 🍿'
    },
    {
      id: 'tx_mock_8',
      type: 'expense',
      amount: 65000,
      category: 'Hiburan',
      date: getDateOffset(5),
      notes: 'Langganan Spotify Family + Netflix 💻'
    },
    {
      id: 'tx_mock_9',
      type: 'expense',
      amount: 120000,
      category: 'Belanja',
      date: getDateOffset(4),
      notes: 'Beli Kaos Distro Keren 🛍️'
    },
    {
      id: 'tx_mock_10',
      type: 'expense',
      amount: 28000,
      category: 'Makanan',
      date: getDateOffset(3),
      notes: 'Nasi Padang Ayam Pop 🍛'
    },
    {
      id: 'tx_mock_11',
      type: 'expense',
      amount: 150000,
      category: 'Gym',
      date: getDateOffset(2),
      notes: 'Iuran Gym Bulanan 🏋️'
    },
    {
      id: 'tx_mock_12',
      type: 'expense',
      amount: 40000,
      category: 'Lainnya',
      date: getDateOffset(1),
      notes: 'Laundry Selimut & Jaket KKN'
    }
  ];

  // Set the credentials in Storage
  userDisplayName = 'Rizky Mahesa (Demo)';
  localStorage.setItem('dompetku_user_name', 'Rizky Mahesa (Demo)');
  transactions = mockTransactions;
  saveTransactionsToStorage();
  renderAuthRoute();
}

// ==========================================
// 📐 CALCULATIONS & FINANCIAL RECALC
// ==========================================
function recalculateDashboard() {
  // 1. Math counters
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  // 2. DOM Updates for Counters
  const totalSaldoEl = document.getElementById('total-saldo');
  const totalPemasukanEl = document.getElementById('total-pemasukan');
  const totalPengeluaranEl = document.getElementById('total-pengeluaran');

  if (totalSaldoEl) totalSaldoEl.textContent = formatRupiah(totalBalance);
  if (totalPemasukanEl) totalPemasukanEl.textContent = formatRupiah(totalIncome);
  if (totalPengeluaranEl) totalPengeluaranEl.textContent = formatRupiah(totalExpense);

  // Manage negative / positive balance warning styles
  if (totalSaldoEl) {
    if (totalBalance < 0) {
      totalSaldoEl.classList.remove('text-white', 'text-emerald-400');
      totalSaldoEl.classList.add('text-rose-400');
    } else {
      totalSaldoEl.classList.remove('text-rose-400');
      totalSaldoEl.classList.add('text-white');
    }
  }

  // 3. Insights Calculator & Badges
  updateInsights(totalExpense);

  // 4. Update Charts
  renderCharts(totalExpense);

  // 5. View Transactions table with current search filters
  applyTransactionFilters();
}

// Insight Box Generator (Find highest expenditure category)
function updateInsights(totalSpending) {
  const categorySpending = {
    Makanan: 0,
    Transportasi: 0,
    Belanja: 0,
    Hiburan: 0,
    Pendidikan: 0,
    Gym: 0,
    Lainnya: 0
  };

  // Filter only expenses
  transactions.filter(t => t.type === 'expense').forEach(tx => {
    if (categorySpending[tx.category] !== undefined) {
      categorySpending[tx.category] += tx.amount;
    }
  });

  // Find max
  let largestCategory = 'Makanan';
  let maxAmount = 0;

  Object.entries(categorySpending).forEach(([cat, amt]) => {
    if (amt > maxAmount) {
      maxAmount = amt;
      largestCategory = cat;
    }
  });

  const badgeEl = document.getElementById('insight-badge');
  const catIconEl = document.getElementById('largest-category-icon');
  const catIconBgEl = document.getElementById('largest-category-icon-bg');
  const catDetailEl = document.getElementById('largest-category-detail');
  const catEvaluationEl = document.getElementById('largest-category-evaluation');

  // Category visual metadata mapping
  const categoryMeta = {
    Makanan: {
      icon: '🍛',
      color: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      evaluate: 'Katanya mau hemat sobat, kurangi sedikit jajan Makanan ya! 🍜'
    },
    Transportasi: {
      icon: '🚗',
      color: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      evaluate: 'Mobilitas kamu tinggi ya! Coba pertimbangkan jalan kaki jika jarak dekat. 🚶'
    },
    Belanja: {
      icon: '🛍️',
      color: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
      evaluate: 'Waduh khilaf belanja terus nih! Bedakan pemenuhan keinginan vs kebutuhan pokok ya. 🛍️'
    },
    Hiburan: {
      icon: '🍿',
      color: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      evaluate: 'Healing sih healing, tapi jangan dihabisin jatah dompetnya buat kesenangan sesaat! 🍿'
    },
    Pendidikan: {
      icon: '🎓',
      color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      evaluate: 'Investasi ilmu dan perintilan kuliah memang penting! Semangat belajarnya ya, calon sarjana! 🎓'
    },
    Gym: {
      icon: '🏋️',
      color: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      evaluate: 'Bagus sekali fokus investasi tubuh sehat! Tapi pastikan belanja suplemen tetap dikontrol. 🏋️'
    },
    Lainnya: {
      icon: '🏷️',
      color: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
      evaluate: 'Ada kebutuhan khusus diluar dugaan ya? Tetap catat detail catatan biar terlacak terus. 🏷️'
    }
  };

  if (maxAmount === 0 || totalSpending === 0) {
    // If no expense at all
    if (catIconBgEl) catIconBgEl.className = 'w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl';
    if (catIconEl) catIconEl.textContent = '⭐️';
    if (catDetailEl) catDetailEl.innerHTML = `Belum Ada Pengeluaran`;
    if (catEvaluationEl) catEvaluationEl.textContent = 'Keren banget, rekor hemat kamu sangat terjaga tanpa pengeluaran sama sekali. Pertahankan!';
  } else {
    // Expense exists
    const meta = categoryMeta[largestCategory] || categoryMeta['Lainnya'];
    const percent = ((maxAmount / totalSpending) * 100).toFixed(0);

    if (catIconBgEl) catIconBgEl.className = `w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${meta.color}`;
    if (catIconEl) catIconEl.textContent = meta.icon;
    if (catDetailEl) {
      catDetailEl.innerHTML = `${largestCategory} (${percent}%) • <span class="font-mono-custom text-emerald-400 font-bold">${formatRupiah(maxAmount)}</span>`;
    }
    if (catEvaluationEl) catEvaluationEl.textContent = meta.evaluate;
  }
}

// ==========================================
// 📊 CHARTS CONTROLLER (APEXCHARTS)
// ==========================================
function renderCharts(totalSpending) {
  // Reset charts if nothing at all
  const hasExpenses = transactions.some(t => t.type === 'expense');

  const chartPieDiv = document.getElementById('chart-pie');
  const chartAreaDiv = document.getElementById('chart-area');
  const donutEmpty = document.getElementById('donut-empty-state');
  const areaEmpty = document.getElementById('area-empty-state');

  if (!hasExpenses) {
    if (chartPie) { chartPie.destroy(); chartPie = null; }
    if (chartArea) { chartArea.destroy(); chartArea = null; }
    if (chartPieDiv) chartPieDiv.classList.add('hidden');
    if (chartAreaDiv) chartAreaDiv.classList.add('hidden');
    donutEmpty?.classList.remove('hidden');
    areaEmpty?.classList.remove('hidden');
    return;
  }

  // Unhide divs
  chartPieDiv?.classList.remove('hidden');
  chartAreaDiv?.classList.remove('hidden');
  donutEmpty?.classList.add('hidden');
  areaEmpty?.classList.add('hidden');

  // Gather categories data
  const categoriesList = ['Makanan', 'Transportasi', 'Belanja', 'Hiburan', 'Pendidikan', 'Gym', 'Lainnya'];
  const categoriesSum = categoriesList.map(cat => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  // Palette matches
  const colorsPalette = ['#f59e0b', '#3b82f6', '#ec4899', '#a855f7', '#10b981', '#ef4444', '#64748b'];

  // Theme support context
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#a3a3a3' : '#64748b';
  const labelColor = isDark ? '#ffffff' : '#0f172a';
  const strokeColor = isDark ? '#171717' : '#ffffff';

  // Render 1. Pie/Donut Chart
  if (chartPie) {
    chartPie.destroy();
  }

  const pieOptions = {
    chart: {
      type: 'donut',
      height: 220,
      background: 'transparent',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600,
      }
    },
    series: categoriesSum,
    labels: categoriesList,
    colors: colorsPalette,
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 2,
      colors: [strokeColor]
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '11px',
              fontFamily: 'Plus Jakarta Sans',
              color: textColor,
              offsetY: -4
            },
            value: {
              show: true,
              fontSize: '15px',
              fontFamily: 'JetBrains Mono',
              fontWeight: 700,
              color: labelColor,
              offsetY: 4,
              formatter: function (val) {
                if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}k`;
                return `Rp ${val}`;
              }
            },
            total: {
              show: true,
              label: 'Pengeluaran',
              color: textColor,
              fontSize: '11px',
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                if (total >= 1000000) return `${(total / 1000000).toFixed(1)}jt`;
                if (total >= 1000) return `${(total / 1000).toFixed(0)}k`;
                return `Rp ${total}`;
              }
            }
          }
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: function (value) {
          return formatRupiah(value);
        }
      }
    }
  };

  chartPie = new ApexCharts(document.querySelector('#chart-pie'), pieOptions);
  chartPie.render();


  // Render 2. Area Spending trend for the last 7 calendar days chronologically
  if (chartArea) {
    chartArea.destroy();
  }

  const dateLabels = [];
  const dateSpending = [];
  
  for (let i = 6; i >= 0; i--) {
    const tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - i);
    const dateStr = tempDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
    dateLabels.push(dateStr);

    // Sum transactions on this date
    const sumOnDate = transactions
      .filter(t => t.type === 'expense' && t.date === dateStr)
      .reduce((sum, tx) => sum + tx.amount, 0);
    dateSpending.push(sumOnDate);
  }

  // Format labels to be readable days like "22 Mei", "21 Mei"
  const formattedDayLabels = dateLabels.map(dStr => {
    const parts = dStr.split('-');
    if (parts.length === 3) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
      const day = parseInt(parts[2]);
      const monthIndex = parseInt(parts[1]) - 1;
      return `${day} ${monthNames[monthIndex]}`;
    }
    return dStr;
  });

  const areaOptions = {
    chart: {
      type: 'area',
      height: 180,
      background: 'transparent',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      toolbar: {
        show: false
      }
    },
    series: [{
      name: 'Pengeluaran',
      data: dateSpending
    }],
    xaxis: {
      categories: formattedDayLabels,
      labels: {
        style: {
          colors: textColor,
          fontSize: '10px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    },
    grid: {
      show: false
    },
    colors: ['#10b981'], // Emerald
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: isDark ? 'dark' : 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95]
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: function (value) {
          return formatRupiah(value);
        }
      }
    }
  };

  chartArea = new ApexCharts(document.querySelector('#chart-area'), areaOptions);
  chartArea.render();
}

// ==========================================
// 🔍 FILTERS & TRANSACTION VIEWER TABLE
// ==========================================
function applyTransactionFilters() {
  const tableBody = document.getElementById('transaction-list-body');
  const emptyState = document.getElementById('empty-state-container');
  const searchInput = document.getElementById('tx-search');
  const categoryFilter = document.getElementById('tx-filter-category');
  const sortFilter = document.getElementById('tx-sort');

  if (!tableBody) return;

  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCat = categoryFilter ? categoryFilter.value : 'ALL';
  const selectedSort = sortFilter ? sortFilter.value : 'newest';

  // 1. Process matching files
  let filtered = transactions.filter(tx => {
    // Search match
    const searchMatch = tx.notes.toLowerCase().includes(searchQuery) || 
                        tx.category.toLowerCase().includes(searchQuery) ||
                        tx.amount.toString().includes(searchQuery);

    // Category match
    const categoryMatch = selectedCat === 'ALL' || tx.category === selectedCat;

    return searchMatch && categoryMatch;
  });

  // 2. Perform Sort Order
  filtered.sort((a, b) => {
    if (selectedSort === 'newest') {
      return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
    } else if (selectedSort === 'oldest') {
      return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
    } else if (selectedSort === 'highest-amount') {
      return b.amount - a.amount;
    } else if (selectedSort === 'lowest-amount') {
      return a.amount - b.amount;
    }
    return 0;
  });

  // 3. Clear existing table paths
  tableBody.innerHTML = '';

  // 4. Handle Empty Vibe States
  if (filtered.length === 0) {
    emptyState?.classList.remove('hidden');
    emptyState?.classList.add('flex');
  } else {
    emptyState?.classList.add('hidden');
    emptyState?.classList.remove('flex');

    // Category Icon Visuals
    const iconDict = {
      Makanan: '🍛',
      Transportasi: '🚗',
      Belanja: '🛍️',
      Hiburan: '🍿',
      Pendidikan: '🎓',
      Gym: '🏋️',
      Lainnya: '🏷️'
    };

    // Render Rows inside table
    filtered.forEach(tx => {
      const tr = document.createElement('tr');
      tr.setAttribute('id', `tx-row-${tx.id}`);
      tr.className = 'border-b border-neutral-800/10 text-xs text-neutral-300 transition-colors duration-150';

      const flowBadge = tx.type === 'income' 
        ? `<span class="inline-flex items-center gap-1 bg-green-500/10 text-green-400 font-bold border border-green-500/15 py-1 px-2.5 rounded-full text-[10px] uppercase tracking-wider">+ Masuk</span>`
        : `<span class="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 font-bold border border-rose-500/15 py-1 px-2.5 rounded-full text-[10px] uppercase tracking-wider">- Keluar</span>`;

      const emoji = iconDict[tx.category] || '🏷️';
      const categoryBadge = `<span class="font-medium text-neutral-100 flex items-center gap-1.5">${emoji} ${tx.category}</span>`;

      // Readable Date Day
      const parts = tx.date.split('-');
      let readableDate = tx.date;
      if (parts.length === 3) {
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        readableDate = `${parts[2]} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
      }

      const amountStyleClass = tx.type === 'income' ? 'text-green-400 font-bold font-mono-custom' : 'text-neutral-100 font-semibold font-mono-custom';
      const signSymbol = tx.type === 'income' ? '+' : '-';

      tr.innerHTML = `
        <td class="py-4 pl-2 font-medium">${flowBadge}</td>
        <td class="py-4">${categoryBadge}</td>
        <td class="py-4 text-neutral-400 text-[11px]">${readableDate}</td>
        <td class="py-4 text-neutral-200 max-w-[150px] truncate" title="${tx.notes}">${tx.notes}</td>
        <td class="py-4 text-right ${amountStyleClass}">${signSymbol}${formatRupiah(tx.amount)}</td>
        <td class="py-4 text-center">
          <button class="delete-tx-row p-1.5 hover:bg-rose-500/10 text-neutral-500 hover:text-rose-400 rounded-lg transition-all border border-transparent hover:border-rose-500/15 cursor-pointer inline-flex items-center justify-center align-middle" data-id="${tx.id}" title="Hapus Transaksi">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    // Rebind delete buttons
    document.querySelectorAll('.delete-tx-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        const txId = targetBtn.getAttribute('data-id');
        if (txId) deleteTransaction(txId);
      });
    });
  }
}

// Controller delete action
function deleteTransaction(id) {
  const transactionDetails = transactions.find(t => t.id === id);
  if (!transactionDetails) return;

  transactionIdToDelete = id;
  const deleteModal = document.getElementById('delete-confirmation-modal');
  const deleteNotesDisplay = document.getElementById('delete-tx-notes-display');
  
  if (deleteNotesDisplay) {
    deleteNotesDisplay.textContent = `"${transactionDetails.notes}"`;
  }
  
  deleteModal?.classList.remove('hidden');
}

// ==========================================
// 📅 EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {

  // A. LOGIN ACTIONS
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('login-username');

    if (nameInput) {
      const username = nameInput.value.trim();
      if (username !== '') {
        setSession(username);
      }
    }
  });

  // B. DEMO PRE_LOAD INSTAN ACCELERATOR
  const demoBtn = document.getElementById('demo-btn');
  demoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    loadDemoMockData();
  });

  // C. THEME MODE SWAP (LIGHT vs DARK)
  const themeToggle = document.getElementById('theme-toggle-btn');
  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('dompetku_theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('dompetku_theme', 'dark');
    }
    syncThemeIcons();
    // Redraw charts with dark/light themes colors!
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    renderCharts(totalExpense);
  });

  // D. LOG OUT ACTION
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn?.addEventListener('click', () => logout());

  // E. TRANSACTION FORM CHOICE (CHIP SELECT: INFLOW OR OUTFLOW)
  const typeExpenseBtn = document.getElementById('tx-type-expense');
  const typeIncomeBtn = document.getElementById('tx-type-income');

  typeExpenseBtn?.addEventListener('click', () => {
    activeTypeSelection = 'expense';
    typeExpenseBtn.className = 'py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all bg-rose-500/5 cursor-pointer hover:bg-rose-500/10 ring-2 ring-rose-500/20';
    typeIncomeBtn.className = 'py-2.5 px-4 rounded-xl border border-neutral-800 text-neutral-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-neutral-800/60';
  });

  typeIncomeBtn?.addEventListener('click', () => {
    activeTypeSelection = 'income';
    typeIncomeBtn.className = 'py-2.5 px-4 rounded-xl border border-green-500/30 text-green-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all bg-green-500/5 cursor-pointer hover:bg-green-500/10 ring-2 ring-green-500/20';
    typeExpenseBtn.className = 'py-2.5 px-4 rounded-xl border border-neutral-800 text-neutral-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-neutral-800/60';
  });

  // Dynamic currency formatting on tx-amount input
  const amountInputEl = document.getElementById('tx-amount');
  amountInputEl?.addEventListener('input', (e) => {
    const target = e.target;
    const cleanVal = target.value.replace(/\D/g, '');
    if (!cleanVal) {
      target.value = '';
      return;
    }
    const num = parseInt(cleanVal, 10);
    target.value = num.toLocaleString('id-ID');
  });

  // Set default form date is today
  const txDateEl = document.getElementById('tx-date');
  if (txDateEl) {
    txDateEl.value = new Date().toISOString().split('T')[0];
  }

  // F. SUBMIT TRANSACTION RECORD
  const txForm = document.getElementById('form-transaction');
  txForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amountEl = document.getElementById('tx-amount');
    const categoryEl = document.getElementById('tx-category');
    const dateEl = document.getElementById('tx-date');
    const notesEl = document.getElementById('tx-notes');

    if (amountEl && categoryEl && dateEl && notesEl) {
      const cleanAmountVal = amountEl.value.replace(/\D/g, '');
      const amountVal = parseFloat(cleanAmountVal);
      const categoryVal = categoryEl.value;
      const dateVal = dateEl.value;
      const notesVal = notesEl.value.trim();

      if (isNaN(amountVal) || amountVal <= 0) {
        alert('Mohon masukkan nominal uang yang valid!');
        return;
      }

      if (notesVal === '') {
        alert('Mohon tulis catatan penjelas untuk memudahkan tracking!');
        return;
      }

      // Create object
      const newTx = {
        id: 'tx_user_' + Date.now().toString() + Math.random().toString(36).substr(2, 5),
        type: activeTypeSelection,
        amount: amountVal,
        category: categoryVal,
        date: dateVal,
        notes: notesVal
      };

      // Add to front of array
      transactions.unshift(newTx);

      // Save transactions
      saveTransactionsToStorage();

      // Recalculate and update UI
      recalculateDashboard();

      // Clear input fields
      amountEl.value = '';
      notesEl.value = '';
    }
  });

  // G. SEARCH & FILTERS ON-CHANGE LOGICS
  const txSearchEl = document.getElementById('tx-search');
  txSearchEl?.addEventListener('input', () => applyTransactionFilters());

  const txFilterCatEl = document.getElementById('tx-filter-category');
  txFilterCatEl?.addEventListener('change', () => applyTransactionFilters());

  const txSortEl = document.getElementById('tx-sort');
  txSortEl?.addEventListener('change', () => applyTransactionFilters());


  // H. LOGOUT MODAL ACTIONS
  const logoutModal = document.getElementById('logout-confirmation-modal');
  const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
  const confirmLogoutBtn = document.getElementById('confirm-logout-btn');

  cancelLogoutBtn?.addEventListener('click', () => {
    logoutModal?.classList.add('hidden');
  });

  confirmLogoutBtn?.addEventListener('click', () => {
    logoutModal?.classList.add('hidden');
    userDisplayName = '';
    transactions = [];
    localStorage.removeItem('dompetku_user_name');
    renderAuthRoute();
  });

  // I. DELETE TRANSACTION MODAL ACTIONS
  const deleteModal = document.getElementById('delete-confirmation-modal');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

  cancelDeleteBtn?.addEventListener('click', () => {
    deleteModal?.classList.add('hidden');
    transactionIdToDelete = null;
  });

  confirmDeleteBtn?.addEventListener('click', () => {
    if (transactionIdToDelete) {
      const id = transactionIdToDelete;
      
      // Filter list
      transactions = transactions.filter(t => t.id !== id);
      
      // Save state
      saveTransactionsToStorage();
      
      // Hide Modal
      deleteModal?.classList.add('hidden');
      transactionIdToDelete = null;

      // Animate delete and update calculation counts
      const row = document.getElementById(`tx-row-${id}`);
      if (row) {
        row.classList.add('opacity-0', 'scale-95', 'bg-rose-500/10');
        setTimeout(() => {
          recalculateDashboard();
        }, 250);
      } else {
        recalculateDashboard();
      }
    }
  });

  // Tap escape key to close logout modal or delete modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      logoutModal?.classList.add('hidden');
      deleteModal?.classList.add('hidden');
    }
  });
}

// ==========================================
// 💡 UTILITY HELPERS
// ==========================================
function startLiveClock() {
  const timeEl = document.getElementById('current-time');
  if (!timeEl) return;

  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}:${seconds} WIB`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}

// Format number to currency IDR
function formatRupiah(value) {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(absValue);
  
  return isNegative ? `-${formatted}` : formatted;
}

// Handle Theme state changes Visual Sync
function syncThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const moonIcon = document.getElementById('theme-moon-icon');
  const sunIcon = document.getElementById('theme-sun-icon');

  if (isDark) {
    moonIcon?.classList.remove('hidden');
    moonIcon?.classList.add('block');
    sunIcon?.classList.remove('block');
    sunIcon?.classList.add('hidden');
  } else {
    moonIcon?.classList.remove('block');
    moonIcon?.classList.add('hidden');
    sunIcon?.classList.remove('hidden');
    sunIcon?.classList.add('block');
  }
}
