"use client";
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function faqsbody() {
   return (
    <>

      <div className="mt-0 px-4 sm:px-10 md:px-20 lg:px-40 py-10 sm:py-14 md:py-20 m-20 rounded-sm border-[#d9d9d9] flex flex-col">
        <h1 className='faqs-h1'>About Bonsai & ZenTree</h1>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3">
  <span className="faqs-span">What is ZenTree?</span> </Typography>

        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            ZenTree is an e-commerce company dedicated to
             selling bonsai trees, gardening tools, and various
              supplies to aid in growing bonsai trees. We deliver
               products to your doorstep and offer step-by-step guides for
             beginners interested in learning the art of bonsai.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>Who can practice the art of bonsai?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Everyone can be a bonsai artist! From complete beginners just starting their journey to experienced hobbyists,
             bonsai is an accessible art form that promotes a healthy, therapeutic lifestyle and offers a peaceful, relaxing hobby at home.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>What is the philosophy behind bonsai?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Bonsai is more than just growing miniature trees; it&apos;s an ancient art form that embodies harmony, patience,
             and a connection with nature. At ZenTree, we believe bonsai promotes mindfulness and creates a peaceful atmosphere in any environment.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>


    {/*QUESTION-SECTION-2*/}



      <h1 className='faqs-h1'>Products & Ordering</h1>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>What types of bonsai does ZenTree offer?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            ZenTree offers 5 basic styles of bonsai: Formal Upright (Chokkan), Informal Upright (Moyogi),
             Slanting (Shakan), Cascade (Kengai), and Semi-cascade (Han-Kengai). We exclusively offer soil-type bonsai, not hydroponic varieties.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>What sizes of bonsai are available?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            ZenTree offers various sizes of bonsai trees, with each tree having its own unique dimensions based on its growth pattern and style.
             You can find detailed size information on each product page.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>Do you sell bonsai tools and supplies?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes! In addition to bonsai trees, we offer a complete selection of professional gardening tools and
             supplies specifically designed for bonsai care and maintenance.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>How do I place an order?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Simply browse our product catalog, add items to your cart, and proceed to checkout. You&apos;ll need to create an account
             or log in to complete your purchase, which also allows you to track your order and view your order history.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>Can I save items for later purchase?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, you can add products to your wishlist by clicking the &apos;Add to Wishlist&apos; button on any product page.
             You&apos;ll need to be logged in to use this feature.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>


    {/*QUESTION-SECTION-3*/}

      <h1 className='faqs-h1'>Shipping & Delivery</h1>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>Where does ZenTree deliver?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We primarily serve customers in Metro Manila with guaranteed delivery service. While we can provide deliveries outside this area, please note that we cannot fully guarantee
             that bonsai products will be delivered in their original condition due to factors such as delivery delays, courier handling, and environmental conditions during transit.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>How are bonsai trees packaged for shipping?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our bonsai trees are carefully packaged with protective materials to ensure they arrive in excellent condition. Each tree is secured
             to prevent soil spillage and branch damage, and we include care instructions with every shipment.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>How can I track my order?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Once your order is shipped, you&apos;ll receive a tracking number via email. You can also view your order status by
             logging into your account and visiting the Order Tracking section.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      {/*QUESTION-SECTION-4*/}


      <h1 className='faqs-h1'>Bonsai Care</h1>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>How do I care for my bonsai tree?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Each bonsai tree comes with specific care instructions. Generally, bonsai require regular watering, proper light exposure,
             occasional fertilizing, and periodic pruning. Visit our Care Guide section for detailed information on caring for different bonsai styles.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>I&apos;m a beginner. Is it difficult to maintain a bonsai?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            While bonsai requires attention and care, our beginner-friendly varieties are selected to be more forgiving and easier to maintain.
             We provide step-by-step guides and are always available to answer your questions to help ensure your success.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>How often should I water my bonsai?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Watering frequency depends on the tree species, pot size, soil composition, and environmental conditions. As a general rule,
             you should check the soil moisture daily and water when the top layer of soil feels dry to the touch. Our Care Guide provides
              specific watering instructions for each bonsai type.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>When and how should I prune my bonsai?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Pruning depends on the species and growth stage of your bonsai. Generally, maintenance pruning can be done year-round to maintain shape,
             while structural pruning is best done during specific seasons. Our Care Guide offers detailed pruning information for each bonsai style.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

    {/*QUESTION-SECTION-5*/}


      <h1 className='faqs-h1'>Account & Website</h1>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>Do I need to create an account to purchase?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, creating an account is required to complete a purchase. This allows you to track your orders, view your order history,
             save items to your wishlist, and receive important notifications about your purchases.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
      
      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>Is ZenTree available as a mobile app?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Currently, ZenTree does not have a dedicated mobile app. However, our website is accessible through mobile browsers for a seamless browsing experience.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>How can I leave a review for a product?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            After purchasing and receiving your product, you can leave a review by logging into your account, navigating to your order history,
             and selecting the &apos;Write a Review&apos; option next to the product.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

      <div>
      <Accordion className='border-1 rounded-sm border-[#d9d9d9]'>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" className="py-3"><span className='faqs-span'>How secure is my payment information?</span></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            ZenTree uses industry-standard encryption and security protocols to ensure your payment information is protected. 
            We do not store your full payment details on our servers.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>

  </div>
    </>

   )
}