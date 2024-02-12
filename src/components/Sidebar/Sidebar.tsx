import styles from './sidebar.module.css';
import logo from '../../../public/logo.png';
import Image from 'next/image';
import { MdOutlinePayments, MdPowerSettingsNew, MdReceiptLong } from 'react-icons/md';
import Link from 'next/link';
import { LuMapPin } from 'react-icons/lu';

const Sidebar = () => {
  return (
    <section className={styles.sidebar}>
      <header>
        <div className={styles.logoBox}>
          <Image alt='' fill sizes='1' src={logo} />
        </div>
        <strong>Super Mc, Adiembra</strong>
      </header>

      <nav>
        <Link href={'/orders'}><MdReceiptLong /> <span>Orders</span></Link>
        <Link href={'/payments'}><MdOutlinePayments /> <span>Payments</span> </Link>
        <Link href={''}> <LuMapPin/> <span>Track Orders</span></Link>
      </nav>

      <footer>
        <Link href={''}><MdPowerSettingsNew/> <span>Logout</span></Link>
      </footer>
    </section>
  );
}

export default Sidebar;