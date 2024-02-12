import styles from './home.module.css';
import logo from '../../public/logo.png';
import Image from 'next/image';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fireAuth } from '@/firebase/base';

const Login = () => {
  console.log('started');
  const loginUser = async (data : FormData)=>{
    'use server'

    const username = data.get('username')?.valueOf();

    const email = `${username}@gmail.com`;
    const password = data.get('password')?.valueOf().toString();

    console.log(email, password);
    signInWithEmailAndPassword(fireAuth, email, password!)
    .then((user)=>{
      console.log(user);
    })
  }

  return (
    <main className={styles.loginBox}>
      <form action={loginUser}>
        <div className={styles.logoBox}>
          <Image alt='' height={40} width={110} src={logo} />
        </div>

        <p>
          <input type="text" name="username" id="" placeholder='Username' required />
          <input type="password" name="password" placeholder='Password' required />
        </p>

        <button type='submit'>Login</button>
      </form>
    </main>
  );
}

export default Login;