import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Unauthorized from './components/Unauthorized'
import Missing from './components/Missing'
import RegistrationForm from './components/RegistrationForm'
import LoginForm from './components/LoginForm'
import { WelcomePage } from './components/Welcome'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<WelcomePage />} />
        </Route>

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;