import { createHashRouter } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout.jsx';
import LandingPage from '../pages/landing/LandingPage.jsx';
import CircuitStudioPage from '../pages/app/circuit-studio/CircuitStudioPage.jsx';
import AlgorithmLibraryPage from '../pages/app/algorithms/AlgorithmLibraryPage.jsx';
import LearnLandingPage from '../pages/app/learn/LearnLandingPage.jsx';
import LearningPathPage from '../pages/app/learn/LearningPathPage.jsx';
import LessonPage from '../pages/app/learn/LessonPage.jsx';
import ExercisesLandingPage from '../pages/app/exercises/ExercisesLandingPage.jsx';
import ExerciseRunnerPage from '../pages/app/exercises/ExerciseRunnerPage.jsx';
import OptimizationLabPage from '../pages/app/optimization/OptimizationLabPage.jsx';
import QMLPage from '../pages/app/qml/QMLPage.jsx';
import DataClusteringPage from '../pages/app/data-clustering/DataClusteringPage.jsx';
import QuantumInfoPage from '../pages/app/quantum-information/QuantumInfoPage.jsx';
import SecurityPage from '../pages/app/security/SecurityPage.jsx';
import HardwareReliabilityPage from '../pages/app/hardware-reliability/HardwareReliabilityPage.jsx';
import DocsPage from '../pages/app/docs/DocsPage.jsx';
import MyWorkspacePage from '../pages/app/workspace/MyWorkspacePage.jsx';
import PlannedPage from '../pages/app/planned/PlannedPage.jsx';

export const router = createHashRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/studio', element: <CircuitStudioPage /> },
      { path: '/algorithms', element: <AlgorithmLibraryPage /> },
      { path: '/learn', element: <LearnLandingPage /> },
      { path: '/learn/path/:pathId', element: <LearningPathPage /> },
      { path: '/learn/path/:pathId/lesson/:lessonId', element: <LessonPage /> },
      { path: '/exercises', element: <ExercisesLandingPage /> },
      { path: '/exercises/:exerciseId', element: <ExerciseRunnerPage /> },
      { path: '/optimization', element: <OptimizationLabPage /> },
      { path: '/qml', element: <QMLPage /> },
      { path: '/data-clustering', element: <DataClusteringPage /> },
      { path: '/quantum-information', element: <QuantumInfoPage /> },
      { path: '/security', element: <SecurityPage /> },
      { path: '/hardware-reliability', element: <HardwareReliabilityPage /> },
      { path: '/docs', element: <DocsPage /> },
      { path: '/workspace', element: <MyWorkspacePage /> },
      { path: '/planned/:name', element: <PlannedPage /> },
      { path: '*', element: <DocsPage /> }
    ]
  }
]);
