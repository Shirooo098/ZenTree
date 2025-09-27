import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export default function CareFAQ () {
    return (
        <main className='flex items-center justify-center text-center flex-col gap-[0vw]'>
            <p className='mb-[2vw] text-4xl font-bold italic'>Frequently Asked Questions</p>
            <div  className='w-[80vw] mb-0'>
                    <Accordion disableGutters  className='border-1 rounded-sm border-[#d9d9d9] text-start'>
                        <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        >
                            <Typography component="span" className="py-3"><span className='faqs-span'>How often should I water my bonsai?</span></Typography>
                        </AccordionSummary>
                        <AccordionDetails  className='mb-0  sx={{ padding: 0 }}'>
                            <Typography >
                                It depends on the species, pot size, soil composition, and environmental conditions. Generally, water when the top layer of soil begins to feel dry. Most bonsai need to be checked daily, especially during growing season and hot weather. Never follow a rigid schedule - instead, learn to recognize when your tree needs water.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters  className='border-1 rounded-sm border-[#d9d9d9] text-start'>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
                            <Typography component="span" className="py-3"><span className='faqs-span'>Can I keep all bonsai trees indoors?</span></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                No, not all bonsai can survive indoors. Tropical and subtropical species like Ficus, Chinese Elm, and Jade can adapt to indoor conditions. However, most temperate species like Junipers, Pines, and Maples need seasonal changes and winter dormancy, requiring them to be kept outdoors. Always research the specific requirements of your bonsai species.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters  className='border-1 rounded-sm border-[#d9d9d9] text-start'>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
                            <Typography component="span" className="py-3"><span className='faqs-span'>When should I repot my bonsai?</span></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>  
                                Most bonsai need repotting every 2-5 years, depending on the species and growth rate. Young, vigorously growing trees may need repotting every 1-2 years, while older, established trees can go longer. The best time to repot is early spring, just as the tree is coming out of dormancy but before new growth emerges.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters  className='border-1 rounded-sm border-[#d9d9d9] text-start '>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
                            <Typography component="span" className="py-3"><span className='faqs-span'>What tools do I need for bonsai maintenance?</span></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Essential bonsai tools include: concave cutters for removing branches, knob cutters for creating jin and shari, bonsai wire cutters, pruning shears, root hooks, wire brushes, and a good pair of tweezers. For beginners, start with pruning shears, wire cutters, and a basic concave cutter. Add more specialized tools as your skills advance.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters className='border-1 rounded-sm border-[#d9d9d9] text-start'>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
                            <Typography component="span" className="py-3"><span className='faqs-span'>Why are the leaves on my bonsai turning yellow? </span></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Yellowing leaves can indicate several issues: overwatering, underwatering, insufficient light, nutrient deficiency, pest infestation, or natural seasonal changes. Check the soil moisture first - it should be moist but not soggy. Ensure your tree is receiving adequate light and nutrients. Inspect for pests on the underside of leaves. Consider if it's autumn and your tree is deciduous, as seasonal yellowing is normal.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion disableGutters  className='border-1 rounded-sm border-[#d9d9d9] text-start'>
                        <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
                            <Typography component="span" className="py-3"><span className='faqs-span'>How do I protect my bonsai from extreme weather?</span></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                               For extreme heat: provide shade, increase watering frequency, use humidity trays, and avoid repotting. For cold weather: move tropical species indoors, protect temperate species by mulching pots, placing in cold frames, or burying pots in the ground. For strong winds: place trees in sheltered locations to prevent drying and branch damage.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    
            </div>
        </main>
    )
}