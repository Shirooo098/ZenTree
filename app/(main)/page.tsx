import ReviewsList from '../components/forms/reviews/ReviewsList';
import BonsaiSection from '../ui/landing/Bonsai-section';
import CheckNow from '../ui/landing/CheckNow';
import Hero from '../ui/landing/Hero';


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
