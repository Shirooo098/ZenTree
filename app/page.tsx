import BonsaiSection from './ui/home/Bonsai-section';
import CheckNow from './ui/home/CheckNow';
import Hero from './ui/home/Hero';
import Reviews from './ui/home/Reviews';

export default function Home() {
  return (
    <>
      <div className='text-dark-brown'>
        <Hero />
        <BonsaiSection/>
        <Reviews/>
        <CheckNow/>
      </div>
    </>
  );
}
