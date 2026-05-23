import { useEffect } from 'react';
import { X, TrendingUp, ReceiptText } from 'lucide-react';

/**
 * SummaryModal Component
 * A centered overlay modal that displays total expense summary.
 *
 * Props:
 *  - isOpen    {bool}    - Whether the modal is visible
 *  - onClose   {func}    - Callback to close the modal
 *  - total     {number}  - Total expenses amount
 *  - expenses  {Array}   - List of expense objects for breakdown
 *  - darkMode  {bool}    - If true, apply dark theme classes
 */
const SummaryModal = ({ isOpen, onClose, total = 0, expenses = [], darkMode = false }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const theme = {
    backdrop: darkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50 backdrop-blur-sm',
    modal: darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    modalShadow: darkMode ? 'shadow-2xl shadow-black/50' : 'shadow-2xl shadow-gray-400/20',
    iconBg: darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600',
    title: darkMode ? 'text-gray-100' : 'text-gray-800',
    subtitle: darkMode ? 'text-gray-400' : 'text-gray-500',
    closeBtn: darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
    totalCard: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100',
    totalIcon: darkMode ? 'text-blue-400' : 'text-blue-600',
    totalLabel: darkMode ? 'text-gray-400' : 'text-gray-600',
    totalAmount: darkMode ? 'text-blue-400' : 'text-blue-700',
    sectionTitle: darkMode ? 'text-gray-400' : 'text-gray-600',
    listItem: darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-gray-50 border-gray-100 hover:bg-gray-100',
    descText: darkMode ? 'text-gray-200' : 'text-gray-800',
    dateText: darkMode ? 'text-gray-500' : 'text-gray-400',
    amountText: darkMode ? 'text-blue-400' : 'text-blue-600',
    emptyText: darkMode ? 'text-gray-500' : 'text-gray-500',
    footerBtn: darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${theme.backdrop}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`relative w-full max-w-md border rounded-2xl p-6 overflow-hidden transition-all duration-300 animate-in fade-in-0 zoom-in-95 duration-200 ${theme.modal} ${theme.modalShadow}`}>
        {/* Decorative subtle glow */}
        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none ${darkMode ? 'bg-blue-900/20' : 'bg-blue-100'}`} />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${theme.iconBg}`}>
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-bold text-lg leading-none tracking-tight ${theme.title}`}>Expense Summary</h2>
              <p className={`text-xs mt-1.5 font-medium ${theme.subtitle}`}>All recorded expenses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${theme.closeBtn}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Display */}
        <div className={`rounded-xl p-5 mb-5 text-center border ${theme.totalCard}`}>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <TrendingUp className={`w-4 h-4 ${theme.totalIcon}`} />
            <span className={`text-xs font-semibold uppercase tracking-wider ${theme.totalLabel}`}>Total Expenses</span>
          </div>
          <p className={`text-3xl font-black ${theme.totalAmount}`}>
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Expenses Breakdown */}
        {expenses.length > 0 && (
          <div className="mb-5">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme.sectionTitle}`}>
              Recent Entries
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {expenses.map((exp, idx) => (
                <li
                  key={idx}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 border transition-colors duration-200 ${theme.listItem}`}
                >
                  <div>
                    <p className={`text-sm font-semibold leading-none ${theme.descText}`}>{exp.description}</p>
                    <p className={`text-xs mt-1 font-medium ${theme.dateText}`}>{exp.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${theme.amountText}`}>
                    ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {expenses.length === 0 && (
          <p className={`text-center text-xs font-medium py-4 ${theme.emptyText}`}>No expenses recorded yet.</p>
        )}

        <button
          onClick={onClose}
          className={`w-full font-semibold text-sm py-2.5 rounded-xl transition-all duration-300 mt-2 cursor-pointer active:scale-[0.98] ${theme.footerBtn}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;