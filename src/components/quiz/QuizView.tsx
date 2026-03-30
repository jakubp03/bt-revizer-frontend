import { useNavigate, useParams } from 'react-router-dom';
import submitData from '../../../test_data/submit_quiz_50pct.json';
import api from '../../services/Api';
import { Button } from '../ui/button';

export default function QuizView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const response = await api.post('/quiz/submitQuiz', submitData);
        navigate(`/quiz/${id}/results/${response.data.attemptId}`, {
            state: { results: response.data },
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
}
