import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { FaDollarSign, FaPiggyBank, FaLightbulb } from 'react-icons/fa';
import { useAuth } from '../contexts/useAuth';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const generateInsights = (transactions, goals) => {
    const insights = [];

    // Group spending by category
    const spendingByCategory = transactions.reduce((acc, tx) => {
        const category = tx.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + parseFloat(tx.amount || 0);
        return acc;
    }, {});
    const totalGoalAmount = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount || 0), 0);
    const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount || 0), 0);
    const overallGoalProgress = totalGoalAmount > 0 ? (totalSaved / totalGoalAmount) * 100 : 0;
    
    // Overspending alert
    const foodSpending = spendingByCategory["Food"] || 0;
    if (foodSpending > 150) {
        insights.push("You've spent over $150 on Food. Consider setting a budget.");
    }

    // Goal progress encouragement
    goals.forEach(goal => {
        const current = parseFloat(goal.currentAmount);
        const amount = parseFloat(goal.targetAmount);
        const percent = amount > 0 ? (current / amount) * 100 : 0;

        if (percent === 100) {
          insights.push(`You're done saving for '${goal.name}! Great Job!'`);
        }
        else if (percent < 40) {
            insights.push(`Consider boosting savings for '${goal.name}'. You're only at ${Math.floor(percent)}%.`);
        } else if (percent >= 80) {
            insights.push(`You're almost done saving for '${goal.name}'. Just ${100 - Math.floor(percent)}% left!`);
        }
    });

    // Overall progress
    if (overallGoalProgress >= 75) {
        insights.push("You're making excellent progress toward your savings goals!");
    } else if (overallGoalProgress < 30) {
        insights.push("Your savings progress is low. Let’s try saving more this month.");
    }
    
    return insights;
};

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [insights, setInsights] = useState([]);
    const { userId } = useAuth();

    useEffect(() => {
      if (!userId) {
        setTransactions([]);
        setGoals([]);
        return;
      }
      
      const transactionsQuery = collection(db, `users/${userId}/transactions`);
      const goalsQuery = collection(db, `users/${userId}/goals`);

      const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
          const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTransactions(transactionsData);
      });

      const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
          const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setGoals(goalsData);
      });

      return () => {
          unsubscribeTransactions();
          unsubscribeGoals();
      };
    }, [userId]);

    useEffect(() => {
        const generatedInsights = generateInsights(transactions, goals);
        setInsights(generatedInsights);
    }, [transactions, goals]);

    const totalSpent = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
    const totalGoalAmount = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount || 0), 0);
    const totalSaved = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount || 0), 0);
    const overallGoalProgress = totalGoalAmount > 0 ? (totalSaved / totalGoalAmount) * 100 : 0;
    
    const spendingByCategory = transactions.reduce((acc, tx) => {
    const category = tx.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + parseFloat(tx.amount || 0);
    return acc;
    }, {});

    const barChartData = Object.entries(spendingByCategory).map(([key, value]) => ({
        category: key,
        amount: value
    }));

    const pieChartData = goals
    .filter(g => parseFloat(g.currentAmount) > 0)
    .map(goal => ({
        name: goal.name || "Unnamed Goal",
        value: parseFloat(goal.currentAmount)
    }));

    const COLORS = ['var(--color-accent-red)', 'var(--color-accent-blue)', '#ffc658', '#82ca9d', '#a4de6c', '#d0ed57', '#83a6ed'];

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center text-light">Dashboard Overview</h2>
            <Row className="mb-4 g-4">
                <Col md={4} className="animate__fadeInUp">
                    <Card className="custom-card">
                        <Card.Body>
                             <Card.Title className="text-primary-dark d-flex align-items-center justify-content-between">
                                <span>Total Spending</span> <FaDollarSign className="text-accent-red fs-4" />
                            </Card.Title>
                            <Card.Text className="fs-4 fw-bold text-accent-red">${totalSpent.toFixed(2)}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="animate__fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <Card className="custom-card">
                        <Card.Body>
                            <Card.Title className="text-primary-dark d-flex align-items-center justify-content-between">
                                <span>Total Saved</span> <FaPiggyBank className="text-accent-blue fs-4" />
                            </Card.Title>
                            <Card.Text className="fs-5 text-secondary-dark">${totalSaved.toFixed(2)} / ${totalGoalAmount.toFixed(2)}</Card.Text>
                            <ProgressBar now={overallGoalProgress} label={`${Math.round(overallGoalProgress)}%`} className="progress-bar-red" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="animate__fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <Card className="custom-card">
                        <Card.Body>
                            <Card.Title className="text-primary-dark d-flex align-items-center justify-content-between">
                                <span>Insights</span> <FaLightbulb className="text-accent-blue fs-4" />
                            </Card.Title>
                            <Card.Text as="ul" className="text-secondary-dark">
                                {insights.length === 0 ? (
                                    <li className="text-muted">No insights to display.</li>
                                ) : (
                                    insights.map((insight, i) => (
                                        <li key={i}>{insight}</li>
                                    ))
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h4 className="mt-5 text-light">Spending by Category</h4>
            <Card className="custom-card p-3 mb-4 animate__fadeInUp" style={{ animationDelay: '0.6s' }}>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-text-dark)" />
                    <XAxis dataKey="category" stroke="var(--color-text-dark)" />
                    <YAxis stroke="var(--color-text-dark)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-secondary-dark)', border: 'none', borderRadius: '0.5rem', color: 'var(--color-text-light)' }} />
                    <Bar dataKey="amount" fill="var(--color-accent-red)" />
                </BarChart>
                </ResponsiveContainer>
            </Card>

            <h4 className="mt-5 text-light">Goal Distribution</h4>
            <Card className="custom-card p-3 mb-4 d-flex justify-content-center align-items-center animate__fadeInUp" style={{ animationDelay: '0.8s' }}>
                <PieChart width={400} height={300}>
                <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="var(--color-accent-blue)"
                    label
                >
                    {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend wrapperStyle={{ color: 'var(--color-card-text)' }} />
                </PieChart>
            </Card>
        </Container>
    );
}
