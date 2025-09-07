import BonsaiSection from '../ui/landing/Bonsai-section';
import CheckNow from '../ui/landing/CheckNow';
import Hero from '../ui/landing/Hero';
import Reviews from '../ui/landing/Reviews';

export default function Home() {
  return (
    <>
      <div className='text-dark-brown'>
        <Hero/>
        <BonsaiSection/>
        <Reviews/>
        <CheckNow/>
      </div>
    </>
  );
}
