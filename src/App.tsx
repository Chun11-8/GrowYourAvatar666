import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateAvatar from './pages/CreateAvatar';
import AvatarView from './pages/AvatarView';
import SelectAvatar from './pages/SelectAvatar';
import GameHub from './pages/GameHub';
import UploadQuiz from './pages/UploadQuiz';
import ManualQuizInput from './pages/ManualQuizInput';

// Game Imports
import ShapeMatching from './pages/games/ShapeMatching';
import AlphabetTap from './pages/games/AlphabetTap';
import Counting from './pages/games/Counting';
import MemoryGame from './pages/games/MemoryGame';
import ColorSorting from './pages/games/ColorSorting';
import MazeRunner from './pages/games/MazeRunner';
import SoundMatching from './pages/games/SoundMatching';
import PatternCompletion from './pages/games/PatternCompletion';
import SizeComparison from './pages/games/SizeComparison';
import NumberOrder from './pages/games/NumberOrder';
import TicTacToe from './pages/games/TicTacToe';
import RockPaperScissors from './pages/games/RockPaperScissors';
import MiniSudoku from './pages/games/MiniSudoku';
import ConnectThree from './pages/games/ConnectThree';
import SimonSays from './pages/games/SimonSays';

import './index.css';
import QuizGeneration from './pages/QuizGeneration';
import QuizUploadSelection from './pages/QuizUploadSelection';
import QuizReview from './pages/QuizReview';
import Quizzes from './pages/Quizzes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-avatar" element={<SelectAvatar />} />
        <Route path="/create-avatar" element={<CreateAvatar />} />
        <Route path="/avatar-view" element={<AvatarView />} />
        <Route path="/upload-quiz" element={<UploadQuiz />} />
        <Route path="/quiz-generation" element={<QuizGeneration />} />
        <Route path="/quiz-upload" element={<QuizUploadSelection />} />
        <Route path="/quiz-review" element={<QuizReview />} />
        <Route path="/quizzes" element={<Quizzes />} />

        <Route path="/manual-quiz" element={<ManualQuizInput />} />
        <Route path="/game-hub" element={<GameHub />} />

        {/* Game Routes */}
        <Route path="/game/shape-matching" element={<ShapeMatching />} />
        <Route path="/game/alphabet-tap" element={<AlphabetTap />} />
        <Route path="/game/counting" element={<Counting />} />
        <Route path="/game/memory" element={<MemoryGame />} />
        <Route path="/game/color-sorting" element={<ColorSorting />} />
        <Route path="/game/maze" element={<MazeRunner />} />
        <Route path="/game/sound-matching" element={<SoundMatching />} />
        <Route path="/game/patterns" element={<PatternCompletion />} />
        <Route path="/game/size-comp" element={<SizeComparison />} />
        <Route path="/game/number-order" element={<NumberOrder />} />
        <Route path="/game/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/game/rps" element={<RockPaperScissors />} />
        <Route path="/game/sudoku" element={<MiniSudoku />} />
        <Route path="/game/connect" element={<ConnectThree />} />
        <Route path="/game/simon" element={<SimonSays />} />
      </Routes>
    </Router>
  );
}

export default App;
