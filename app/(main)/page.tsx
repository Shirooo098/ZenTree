
import { Metadata } from 'next';
import BonsaiSection from '../ui/landing/Bonsai-section';
import CheckNow from '../ui/landing/CheckNow';
import Hero from '../ui/landing/Hero';


export const metadata: Metadata = {
  title: "ZenTree",
};


export default function Home() {
  return (
    <>
      <div className='text-dark-brown'>
        <Hero/>
        <BonsaiSection/>
        <CheckNow/>
      </div>
    </>
  );
}
