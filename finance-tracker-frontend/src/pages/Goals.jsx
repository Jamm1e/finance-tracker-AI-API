import { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { db } from '../firebase'; 
import { useAuth } from '../contexts/useAuth'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: ''
  });
  const [editingId, setEditingId] = useState(null);
  const { userId } = useAuth(); // Get the userId from context

  useEffect(() => {
    if (userId) {
      const q = collection(db, `users/${userId}/goals`);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const goalsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGoals(goalsData);
      });
      return () => unsubscribe();
    } else {
      setGoals([]);
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDelete = async (id) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, `users/${userId}/goals`, id));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal.id);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', targetAmount: '', currentAmount: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, `users/${userId}/goals`, editingId), {
          ...formData,
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount)
        });
      } else {
        await addDoc(collection(db, `users/${userId}/goals`), {
          ...formData,
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount)
        });
      }
      handleCancel();
    } catch (error) {
      console.error("Error submitting goal:", error);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center text-light">Financial Goals</h2>
      <Card className="mb-5 shadow-sm rounded-4 custom-card animate__fadeInUp">
        <Card.Body>
          <Card.Title className="text-primary-dark mb-4">{editingId ? 'Edit Goal' : 'Add New Goal'}</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Goal Title (e.g. Rent)"
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="Goal Amount"
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  placeholder="Current Saved"
                  required
                />
              </Col>
              <Col md={2} className="d-flex gap-2">
                <Button type="submit" variant="primary" className="w-100">
                  {editingId ? 'Update' : 'Add'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline-secondary" onClick={handleCancel} className="w-100">
                    Cancel
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <Row className="g-4">
        {goals.length === 0 ? (
          <Col className="text-center text-muted mt-5">
            <p>No goals found. Add a new goal to get started!</p>
          </Col>
        ) : (
          goals.map((goal, index) => {
            const current = parseFloat(goal.currentAmount);
            const amount = parseFloat(goal.targetAmount);
            const percent = amount > 0 ? Math.min((current / amount) * 100, 100) : 0;
            return (
              <Col md={6} lg={4} key={goal.id} className="mb-3 animate__fadeInUp" style={{ animationDelay: `${0.1 * index}s` }}>
                <Card className="custom-card">
                  <Card.Body>
                    <Card.Title className="text-primary-dark">{goal.name}</Card.Title>
                    <Card.Text className="text-secondary-dark">${current.toFixed(2)} / ${amount.toFixed(2)}</Card.Text>
                    <ProgressBar now={percent} label={`${Math.round(percent)}%`} className="progress-bar-red" />
                    <div className="d-flex gap-2 mt-3">
                      <Button variant="outline-info" size="sm" onClick={() => handleEdit(goal)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(goal.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </Container>
  );
}
