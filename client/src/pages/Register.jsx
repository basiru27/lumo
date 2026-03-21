import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else nav('/');
  }

  return (
    <div className='max-w-sm mx-auto p-6 mt-12 bg-white border border-gray-200 rounded-lg shadow-sm'>
      <h1 className='text-2xl font-bold mb-6 text-primary text-center'>Register</h1>
      <form onSubmit={handleRegister} className='space-y-4'>
        <input type='email' required placeholder='Email'
          value={email} onChange={e => setEmail(e.target.value)}
          className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary' />
        <input type='password' required placeholder='Password'
          value={password} onChange={e => setPassword(e.target.value)}
          className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary' />
        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        <button type='submit'
          className='w-full bg-primary text-white rounded-lg py-3 font-semibold hover:bg-opacity-90 transition'>
          Register
        </button>
      </form>
      <p className='text-sm mt-6 text-center text-gray-600'>
        Already have an account? <Link to='/login' className='text-primary font-medium hover:underline'>Sign In</Link>
      </p>
    </div>
  );
}
