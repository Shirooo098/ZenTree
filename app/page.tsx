import BonsaiSection from './ui/home/Bonsai-section';
import CheckNow from './ui/home/CheckNow';
import Hero from './ui/home/Hero';

export default function Home() {
  return (
    <>
      <div className='text-dark-brown'>
        <Hero />
        <BonsaiSection/>
        <CheckNow/>
      </div>
    </>
  );
}
