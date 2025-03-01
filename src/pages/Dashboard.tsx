import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  user_id: string;
}

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<{[key: string]: number}>({});
  const [categoryExpenses, setCategoryExpenses] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        const expensesData = data as Expense[];
        let total = 0;
        const monthlyData: {[key: string]: number} = {};
        const categoryData: {[key: string]: number} = {};

        expensesData.forEach((expense) => {
          total += expense.amount;

          // Process monthly data
          const date = new Date(expense.date);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          monthlyData[monthYear] = (monthlyData[monthYear] || 0) + expense.amount;

          // Process category data
          categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
        });

        setExpenses(expensesData);
        setTotalAmount(total);
        setMonthlyExpenses(monthlyData);
        setCategoryExpenses(categoryData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const doughnutData = {
    labels: Object.keys(categoryExpenses),
    datasets: [
      {
        data: Object.values(categoryExpenses),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const barData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [
      {
        label: 'Gastos Mensuales',
        data: Object.values(monthlyExpenses),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Find highest and lowest expense
  let highestExpense = { amount: 0, description: '' };
  let lowestExpense = { amount: Infinity, description: '' };
  
  expenses.forEach(expense => {
    if (expense.amount > highestExpense.amount) {
      highestExpense = { amount: expense.amount, description: expense.description };
    }
    if (expense.amount < lowestExpense.amount) {
      lowestExpense = { amount: expense.amount, description: expense.description };
    }
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Gastos</p>
              <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Total Registros</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500">Mayor Gasto</p>
              <p className="text-2xl font-bold">${highestExpense.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{highestExpense.description}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500">Menor Gasto</p>
              <p className="text-2xl font-bold">
                ${lowestExpense.amount === Infinity ? '0.00' : lowestExpense.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {lowestExpense.amount === Infinity ? 'N/A' : lowestExpense.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Gastos por Categoría</h2>
          <div className="h-64">
            {Object.keys(categoryExpenses).length > 0 ? (
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Gastos Mensuales</h2>
          <div className="h-64">
            {Object.keys(monthlyExpenses).length > 0 ? (
              <Bar 
                data={barData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;