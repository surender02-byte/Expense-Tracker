import { useState, useEffect } from 'react';
import { Layers, FileText, IndianRupee, Plus, AlertCircle, Sun, Moon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import GroupCard from '../components/GroupCard';
import AddExpenseForm from '../components/AddExpenseForm';
import SummaryModal from '../components/SummaryModal';
import UserProfile from '../components/UserProfile';

// ─── Sample Mock Data ───────────────────────────────────────────────────────────
const INITIAL_GROUPS = [
  { groupName: 'CSK Cricket Team', summary: 'Ticket Fees, Jerseys & Snacks for the match day.' },
  { groupName: 'Trip to Goa', summary: 'Flight, hotel, and nightlife expenses split among 6 friends.' },
  { groupName: 'House Expenses', summary: 'Monthly rent, electricity, internet, and groceries.' },
  { groupName: 'Office Lunch', summary: 'Daily lunch pooling with team members.' },
  { groupName: 'Weekend Party', summary: 'DJ, venue, drinks & food for Saturday night.' },
  { groupName: 'Gym Membership', summary: 'Annual gym memberships paid collectively.' },
];

// ─── Helper (kept for potential use) ───────────────────────────────────────────
const daysAgo = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expenseDate = new Date(dateString);
  expenseDate.setHours(0, 0, 0, 0);
  const diffTime = today - expenseDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ─── Dashboard Page ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });
        if (fetchError) throw fetchError;
        setExpenses(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to load expenses: ' + (err.message || ''));
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Compute total from all expenses
  const total = expenses.reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);

  // Attach a rough amount to each group for display (mock data mixed with real)
  const groupsWithAmounts = INITIAL_GROUPS.map((g, i) => ({
    ...g,
    amount: expenses[i]?.amount || Math.floor(Math.random() * 8000 + 500),
  }));

  // Handle new expense added from form
  const handleAddExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  // Professional stat cards – only 3, larger and attractive
  const statCards = [
    {
      label: 'Total Groups',
      value: INITIAL_GROUPS.length,
      icon: Layers,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'Total Transactions',
      value: expenses.length,
      icon: FileText,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Total Spent',
      value: `₹${total.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  // Theme classes
  const theme = {
    bg: darkMode ? 'bg-gray-950' : 'bg-gray-50',
    cardBg: darkMode ? 'bg-gray-900' : 'bg-white',
    cardBorder: darkMode ? 'border-gray-800' : 'border-gray-200',
    textPrimary: darkMode ? 'text-white' : 'text-gray-800',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-500',
    headerBg: darkMode ? 'bg-gray-900' : 'bg-white',
    headerBorder: darkMode ? 'border-gray-800' : 'border-gray-200',
    tableHeaderBg: darkMode ? 'bg-gray-800' : 'bg-gray-50',
    tableRowHover: darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50',
  };

  return (
    <div className={`min-h-screen ${theme.bg} font-sans transition-colors duration-300`}>
      {/* Header with Theme Toggle */}
      <div className={`${theme.headerBg} border-b ${theme.headerBorder} shadow-sm sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>Expense-Tracker</h1>
              <p className={`${theme.textSecondary} text-sm mt-1`}>
                Welcome to the Expense-Tracker Demo.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <UserProfile />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Large, Attractive Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                         bg-gradient-to-br ${stat.gradient} p-6 text-white`}
            >
              {/* Decorative blur circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
              <div className="flex items-center justify-between">
                <stat.icon className="w-10 h-10 opacity-80 drop-shadow-md" />
                <span className="text-4xl font-black tracking-tight drop-shadow-sm">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-wider mt-3 opacity-90">
                {stat.label}
              </p>
              <div className="mt-2 h-0.5 w-12 bg-white/30 rounded-full" />
            </div>
          ))}
        </div>

        {/* ── Recent Transactions Table ── */}
        <div className={`${theme.cardBg} rounded-2xl shadow-xl border ${theme.cardBorder} overflow-hidden mb-10`}>
          <div className={`px-6 py-5 ${theme.tableHeaderBg} border-b ${theme.cardBorder}`}>
            <h2 className={`text-lg font-bold ${theme.textPrimary}`}>Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className={theme.tableHeaderBg}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.textSecondary} uppercase tracking-wider`}>Job Title</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.textSecondary} uppercase tracking-wider`}>Website</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.textSecondary} uppercase tracking-wider`}>Staff</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.textSecondary} uppercase tracking-wider`}>Invoicable Amount</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.textSecondary} uppercase tracking-wider`}>Completed Date</th>
                </tr>
              </thead>
              <tbody className={`${theme.cardBg} divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-200'}`}>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Loading transactions...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-red-500">
                      <AlertCircle className="inline w-5 h-5 mr-2" />
                      {error}
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No expenses found. Add one using the form.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className={`${theme.tableRowHover} transition-colors duration-200`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme.textPrimary}`}>
                        {exp.description}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.textSecondary}`}>N/A</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.textSecondary}`}>Administrator</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ₹{parseFloat(exp.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.textSecondary}`}>{exp.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Expense Groups & Add Expense Form ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left – Groups */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className={`${theme.textSecondary} font-bold text-sm uppercase tracking-wider`}>
                Expense Groups
              </h2>
              <span className={`text-xs ${theme.textSecondary} bg-gray-200/20 px-2 py-1 rounded-full`}>
                {INITIAL_GROUPS.length} groups
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {groupsWithAmounts.map((group) => (
                <GroupCard
                  key={group.groupName}
                  groupName={group.groupName}
                  summary={group.summary}
                  amount={group.amount}
                  onClick={() => setModalOpen(true)}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>

          {/* Right – Add Expense Form */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`${theme.textSecondary} font-bold text-sm uppercase tracking-wider`}>
                New Entry
              </h2>
            </div>
            <AddExpenseForm onAddExpense={handleAddExpense} darkMode={darkMode} />
            <button
              onClick={() => setModalOpen(true)}
              className={`mt-5 w-full flex items-center justify-center gap-2 ${theme.cardBg} border ${theme.cardBorder} ${theme.textPrimary} font-semibold text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <Plus className="w-4 h-4" />
              View Full Summary
            </button>
          </div>
        </div>
      </main>

      {/* ── Summary Modal ── */}
      <SummaryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        total={total}
        expenses={expenses}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Dashboard;