import Hero     from '../components/home/Hero'
import TrustBar from '../components/home/TrustBar'
import FAQ      from '../components/home/FAQ'

// Coming next:
// import Services   from '../components/home/Services'
// import Packages   from '../components/home/Packages'
// import VideoReviews from '../components/home/VideoReviews'
// import Portfolio  from '../components/home/Portfolio'
// import BookingCTA from '../components/home/BookingCTA'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      {/* <Services /> */}
      {/* <Packages /> */}
      {/* <VideoReviews /> */}
      {/* <Portfolio /> */}
      <FAQ />
      {/* <BookingCTA /> */}
    </>
  )
}