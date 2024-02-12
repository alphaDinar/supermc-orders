'use client'
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from './orders.module.css';
import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { fireAuth, fireStoreDB } from "@/firebase/base";
import { getTimeSince, sortByTime } from "@/services/timeServices";
import { calcGroupedOrderTotal, getTripOrderCount } from "@/services/menuServices";
import 'swiper/css/pagination';
import 'swiper/css';
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MdAddCircle, MdArrowForward, MdBolt, MdCancel } from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { IoStorefront, IoStorefrontOutline } from "react-icons/io5";
import Lottie from "lottie-react";
import emptyAnimation from '../../../public/empty.json';
import Empty from "@/components/Empty/Empty";

interface Trip extends Record<string, any> {
};

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingTrips, setPendingTrips] = useState<Trip[]>([]);
  const [readyTrips, setReadyTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip>({})
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const tripSwiper = useRef<{ swiper: any }>({ swiper: null });


  useEffect(() => {
    //query for completed false only
    const tripStream = onSnapshot(collection(fireStoreDB, 'Trips/'), (snapshot) => {
      const tripsTemp: Trip[] = snapshot.docs.map((trip) => ({ id: trip.id, ...trip.data() }));
      const tripsTempFiltered: Trip[] = tripsTemp.filter((trip) => trip.bid === 'super mc, Adiembra').sort(sortByTime).reverse();
      setPendingTrips(tripsTempFiltered.filter((trip) => trip.status === 0));
      setReadyTrips(tripsTempFiltered.filter((trip) => trip.status === 1));
      setIsLoading(false);
    })

    return () => tripStream();
  }, [])


  const tripSwiperNav = (index: number) => {
    setCurrentSlide(index);
    if (tripSwiper.current) {
      tripSwiper.current.swiper.slideTo(index);
    }
  }

  const pushTrip = async (id: string, statusTimestamps: number[]) => {
    statusTimestamps.push((Date.now() * 1000));
    await updateDoc(doc(fireStoreDB, 'Trips/' + id), {
      status: 1,
      statusTimestamps: statusTimestamps
    })
      .then(() => {
        setSelectedTrip({});
      })
  }

  const startTrip = async (id: string, statusTimestamps: number[]) => {
    statusTimestamps.push((Date.now() * 1000));
    await updateDoc(doc(fireStoreDB, 'Trips/' + id), {
      status: 2,
      statusTimestamps: statusTimestamps
    })
      .then(() => {
        setSelectedTrip({});
      })
  }

  return (
    <main>
      <Sidebar />
      <section className={`tray ${styles.orderTray}`}>
        <header>
          <h3>Orders({pendingTrips.length + readyTrips.length}) <sub></sub></h3>
          <nav>
            <legend onClick={() => { tripSwiperNav(0) }} style={currentSlide === 0 ? { borderBottom: '4px solid #79B0FF' } : { borderBottom: '4px solid transparent' }}>Pending({pendingTrips.length})</legend>
            <legend onClick={() => { tripSwiperNav(1) }} style={currentSlide === 1 ? { borderBottom: '4px solid #79B0FF' } : { borderBottom: '4px solid whitesmoke' }} >Ready({readyTrips.length})</legend>
          </nav>
        </header>

        <Swiper
          speed={100}
          ref={tripSwiper}
          autoplay={{ delay: 3500, disableOnInteraction: true, pauseOnMouseEnter: true }}
          style={{ width: '100%' }}
          className={styles.tripSwiper}
        >
          <SwiperSlide>
            <>
              {pendingTrips.length > 0 ?
                <section className='trips scroll'>
                  {pendingTrips.map((trip, i) => (
                    <div key={i} className={styles.trip} onClick={() => { setSelectedTrip(trip) }}>
                      <p>
                        <sup>{trip.id}</sup>
                        <sub style={{ background: 'tomato' }}></sub>
                      </p>
                      <p><sup>{trip.customer.username}</sup></p>
                      <p>
                        <strong>GH₵ {trip.tripTotal.toLocaleString()}</strong>
                        <span>{getTripOrderCount(trip.orders)}</span>
                      </p>
                      <p>
                        <small>{getTimeSince(trip.timestamp / 1000)}</small>

                        {trip.deliveryOption === 'Doorstep delivery' ? <FaMotorcycle style={{ fontSize: '1.5rem' }} /> : <IoStorefront style={{ fontSize: '1.5rem' }} />}
                      </p>
                    </div>
                  ))}
                </section>
                :
                <div>
                  ...
                </div>
              }
            </>
          </SwiperSlide>

          <SwiperSlide>
            <>
              {readyTrips.length > 0 ?
                <section className='trips scroll'>
                  {readyTrips.map((trip, i) => (
                    <div key={i} className={styles.trip} onClick={() => { setSelectedTrip(trip) }}>
                      <p>
                        <sup>{trip.id}</sup>
                        <sub style={{ background: 'var(--pass)' }}></sub>
                      </p>
                      <p>
                        <sup>{trip.customer.username}</sup>
                        <legend style={Object.keys(trip.rider).length > 0 ? { background: 'var(--pass)' } : { background: 'tomato' }}
                          className={styles.riderTag}>{Object.keys(trip.rider).length > 0 ? 'Incoming Rider' : 'No Rider Yet'}</legend>
                      </p>
                      <p>
                        <strong>GH₵ {trip.tripTotal.toLocaleString()}</strong>
                        <span>{getTripOrderCount(trip.orders)}</span>
                      </p>
                      <p>
                        <small>{getTimeSince(trip.timestamp / 1000)}</small>

                        {trip.deliveryOption === 'Doorstep delivery' ? <FaMotorcycle style={{ fontSize: '1.5rem' }} /> : <IoStorefront style={{ fontSize: '1.5rem' }} />}
                      </p>
                    </div>
                  ))}
                </section>
                :
                <div>
                  ...
                </div>
              }
            </>
          </SwiperSlide>
        </Swiper>

      </section>

      <section className={`infoBox ${styles.orderInfoBox}`}>
        <header>
          <h3>Order Info <sub></sub></h3>

          {Object.keys(selectedTrip).length > 0 &&
            <>
              <strong>Total = GH₵ {selectedTrip.tripTotal.toLocaleString()}</strong>
              <sup>Delivery = GH₵ {selectedTrip.deliveryFee.toLocaleString()}</sup>
              {selectedTrip.status === 0 ?
                <button onClick={() => { pushTrip(selectedTrip.id, selectedTrip.statusTimestamps) }}>Done <FaMotorcycle /> </button>
                :
                Object.keys(selectedTrip.rider).length > 0 &&
                <button style={{ background: 'var(--tab)' }} onClick={() => { startTrip(selectedTrip.id, selectedTrip.statusTimestamps) }}>Picked Up <FaMotorcycle /> </button>
              }
            </>
          }

        </header>
        <section className={`${styles.orderBox} scroll`}>
          {
            !isLoading ?
              Object.keys(selectedTrip).length > 0 ?
                <section className={styles.tripOrders}>
                  {selectedTrip.orders.map((order: Trip, i: number) => (
                    order.category === 'Drinks' ?
                      <section className={styles.groupedOrder} key={i}>
                        <div className={styles.con}>
                          <div className={styles.imgBox}>
                            <Image alt="" fill sizes="1" src={order.img} />
                          </div>
                          <span>{order.name}</span>
                          <sub>{order.price}  x  {order.quantity}</sub>
                          <strong>GH₵ {order.price * order.quantity}</strong>
                        </div>
                      </section>
                      :
                      <section className={styles.groupedOrder} key={i}>
                        <div className={styles.con}>
                          <div className={styles.imgBox}>
                            <Image alt="" fill sizes="1" src={order.img} />
                          </div>
                          <span>{order.name}</span>
                          {order.type === 'grouped' &&
                            <sup>{order.tag}</sup>}
                          <sub>{order.price}  x  {order.quantity}</sub>
                          <strong>GH₵ {calcGroupedOrderTotal(order).toLocaleString()}</strong>
                        </div>
                        {order.blackList.length > 0 &&
                          <div className={styles.blackList}>
                            <MdCancel className={styles.icon} />
                            {order.blackList.map((el: string, i: number) => (
                              <legend key={i}>{el}</legend>
                            ))}
                          </div>
                        }

                        {order.extraList.length > 0 &&
                          <div className={styles.extraList}>
                            <MdAddCircle className={styles.icon} />
                            {order.extraList.map((el: Trip, i: number) => (
                              <legend key={i}>{el.name} <MdArrowForward /> ₵ {el.price}</legend>
                            ))}
                          </div>
                        }
                      </section>

                    // }
                  ))}
                </section>
                :
                <Empty />
              :
              <div>Loader</div>
          }
        </section>
      </section>
    </main>
  );
}

export default Orders;