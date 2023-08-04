import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'
import { useSelector } from 'react-redux';
import './App.css';
import { Sidebar, Contacts, Profile } from './features';
import { MainLayout, SecondLayout, ThirdLayout } from './layouts';
import { Home, Setting, Friends, Watch } from './pages';

function App() {
  const profile = useSelector(state => state.action.profile);
  const queryClient = new QueryClient();
  const { username } = useParams();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout children={ <> <Home /> <Contacts /> </> } />} />
          <Route path="/auth/login" element={<SecondLayout children={{isRegister: false}} />} />
          <Route path="/auth/register" element={<SecondLayout children={{isRegister: true}} />} />
          <Route path="/:username" element={<ThirdLayout children={<> <Profile {...profile} /> </>} />} />
          <Route path="/setting" element={<ThirdLayout children={<> <Setting /> </>} />} />
          <Route path="/friends" element={<ThirdLayout children={<> <Friends /> </> } />} />
          <Route path="/watch" element={<MainLayout children={ <> <Watch /> </> } /> } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
