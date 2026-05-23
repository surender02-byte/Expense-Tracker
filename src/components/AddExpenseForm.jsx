import { useState } from 'react';
import { PlusCircle, DollarSign, FileText, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

/**
 * AddExpenseForm Component
 * Inserts expenses without requiring login (anon mode).
 * RLS must allow anon inserts — see SQL note below.
 *
 * Props:
 *  - onAddExpense  {func}  - Callback with expense data { amount, description, date }
 *  - darkMode      {bool}  - If true, apply dark theme classes
 */
const AddExpenseForm = ({ onAddExpense, darkMode = false }) => {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors]             = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg]     = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      errs.amount = 'Amount must be a number greater than 0.';
    }
    if (!form.description.trim()) {
      errs.description = 'Description is required.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const expenseData = {
        amount:      parseFloat(form.amount),
        description: form.description.trim(),
        date:        form.date,
      };

      console.debug('[AddExpense] Inserting:', expenseData);

      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseData])
        .select()
        .single();

      if (error) {
        console.error('[AddExpense] Error:', error);
        throw error;
      }

      console.debug('[AddExpense] Inserted:', data);
      onAddExpense?.(data);

      setForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      setSuccessMsg('Expense added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to add expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const theme = {
    container: darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    headerBg: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200',
    headerText: darkMode ? 'text-gray-200' : 'text-gray-700',
    iconBg: darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600',
    label: darkMode ? 'text-gray-400' : 'text-gray-600',
    input: darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-blue-600' : 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:ring-blue-200',
    errorText: darkMode ? 'text-red-400' : 'text-red-600',
    errorBg: darkMode ? 'bg-red-950/50 border-red-800' : 'bg-red-50 border-red-200',
    successBg: darkMode ? 'bg-green-950/50 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700',
    button: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700', // same color, works in both
  };

  return (
    <div className={`rounded-xl shadow-md border p-6 transition-all duration-300 ${theme.container}`}>
      <div className={`flex items-center gap-3 mb-6 ${theme.headerBg} -m-6 mb-0 p-4 rounded-t-xl border-b`}>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${theme.iconBg}`}>
          <PlusCircle className="w-5 h-5" />
        </div>
        <h2 className={`font-bold text-base tracking-tight ${theme.headerText}`}>Add New Expense</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-4">

        {/* Amount */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${theme.label}`}>Amount (₹)</label>
          <div className="relative group">
            <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} />
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm transition-all duration-350 focus:outline-none focus:ring-2 focus:border-transparent ${theme.input} ${errors.amount ? 'border-red-500 focus:ring-red-200' : ''}`}
            />
          </div>
          {errors.amount && (
            <p className={`flex items-center gap-1.5 mt-1.5 text-xs font-medium ${theme.errorText}`}>
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.amount}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${theme.label}`}>Description</label>
          <div className="relative group">
            <FileText className={`absolute left-3 top-3 w-4 h-4 ${darkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-600'}`} />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What was this expense for?"
              rows={2}
              className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm resize-none transition-all duration-350 focus:outline-none focus:ring-2 focus:border-transparent ${theme.input} ${errors.description ? 'border-red-500 focus:ring-red-200' : ''}`}
            />
          </div>
          {errors.description && (
            <p className={`flex items-center gap-1.5 mt-1.5 text-xs font-medium ${theme.errorText}`}>
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{errors.description}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${theme.label}`}>Date</label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${theme.input}`}
            />
          </div>
        </div>

        {/* Success */}
        {successMsg && (
          <p className={`text-xs rounded-xl px-3.5 py-2 text-center font-medium shadow-sm animate-pulse border ${theme.successBg}`}>
            {successMsg}
          </p>
        )}

        {/* General error */}
        {errors.form && (
          <p className={`flex items-center justify-center gap-1.5 text-xs rounded-xl px-3.5 py-2 font-medium animate-pulse border ${theme.errorBg} ${theme.errorText}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{errors.form}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white font-bold text-sm py-2.5 rounded-xl mt-2 transition-all duration-300 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm ${theme.button}`}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;