// components


// sections
import Hero from "./hero";
import TopBookCategories from "./top-book-categories";
import BackToSchoolBooks from "./back-to-school-books";
import OtherBookOffers from "./other-book-offers";
import CarouselFeatures from "./carousel-features";
import GetYourBookFromUs from "./get-your-book-from-us";
import EducationPortalSection from "./education-portal";
import Faq from "./faq";

export default function Campaign() {
  return (
    <>
      <Hero />
      <TopBookCategories />
      <BackToSchoolBooks />
      <OtherBookOffers />
      <EducationPortalSection /> 
      <CarouselFeatures />
      <GetYourBookFromUs />
      <Faq />
     
    </>
    
  );
}
