import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import Button from "../HomePage/Button";

const LearningGridArray = [
    {
      order: -1,
      heading: "World-Class Learning for",
      highlightText: "Anyone, Anywhere",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
      BtnText: "Learn More",
      BtnLink: "/",
    },
    {
      order: 1,
      heading: "Curriculum Based on Industry Needs",
      description:
        "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
      order: 2,
      heading: "Our Learning Methods",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 3,
      heading: "Certification",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 4,
      heading: `Rating "Auto-grading"`,
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 5,
      heading: "Ready to Work",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
  ];

const LearningGrid = () => {
  return (
    <div className='grid mx-auto grid-cols-1 gap-4 lg:gap-0 lg:grid-cols-4'>
        {
          LearningGridArray.map( (card ,index) => {
              return (
                <div
                  key={index}
                  className={`${index === 0 && "lg:col-span-2"}                     
                    ${card.order === 3 && "lg:col-start-2"}
                  `}
                  >
                    {
                      card.order < 0 ? 
                      (
                        <div className='lg:w-[90%] flex flex-col items-start gap-6'>
                          <h1 className='text-4xl font-semibold'>
                            {card.heading}
                            <HighlightText text={card.highlightText}/>
                          </h1>
                          <p className='text-richblack-300 font-medium text-base'>
                            {card.description}
                          </p>
                          <Button 
                            active={true}
                            linkto={card.BtnLink}
                            >
                            {card.BtnText}
                          </Button>
                        </div>
                      ) : (
                        <div className={`${card.order%2 === 1 ? "bg-richblack-700" : "bg-richblack-800"} 
                                lg:h-[300px] py-10 px-8`}>
                          
                            <h2 className='text-lg font-semibold mb-10'>
                              {card.heading}
                            </h2>
                            <p className='text-base font-normal text-richblack-300'>
                              {card.description}
                            </p>
                          
                        </div>
                      )
                    }
                </div>
              )
          })
        }
    </div>
  )
}

export default LearningGrid