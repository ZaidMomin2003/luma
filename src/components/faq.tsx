'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQ() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'How does the AI generate questions from my video?',
      answer: 'Our AI transcribes your video using advanced speech-to-text, then analyzes key topics, concepts, and moments to generate contextual multiple-choice questions. Questions are automatically placed at optimal timestamps based on content relevance.',
    },
    {
      id: 'item-2',
      question: 'Can I customize the AI-generated questions?',
      answer: 'Absolutely. After AI generation, you can edit, remove, or add your own questions. You also control the timing, frequency, and difficulty of question appearances. The AI provides a starting point that you can refine.',
    },
    {
      id: 'item-3',
      question: 'What video formats and lengths are supported?',
      answer: 'We support all major video formats including MP4, MOV, AVI, and WebM. Videos can be up to 2 hours long on the Pro plan and up to 4 hours on Enterprise. File size limit is 2GB for Pro and unlimited for Enterprise.',
    },
    {
      id: 'item-4',
      question: 'How does multilingual translation work?',
      answer: 'Our AI can translate both the video transcript and generated questions into 50+ languages. You can serve localized experiences automatically based on viewer location, or let viewers manually switch languages.',
    },
    {
      id: 'item-5',
      question: 'Can I embed interactive videos on my website?',
      answer: 'Yes! Every campaign generates an embed code that you can place on any website. The interactive player works seamlessly in any modern browser and is fully responsive across desktop, tablet, and mobile devices.',
    },
    {
      id: 'item-6',
      question: 'Do viewers need to create an account to watch?',
      answer: 'No. Viewers can watch and interact with your campaigns without creating an account. You can optionally collect their email before the video starts, but it is not required.',
    },
    {
      id: 'item-7',
      question: 'What analytics do I get from viewer responses?',
      answer: 'You get completion rates, average watch time, question-by-question performance, drop-off points, most replayed moments, regional breakdown, hourly engagement patterns, and AI-generated insight summaries.',
    },
    {
      id: 'item-8',
      question: 'Is there a free plan?',
      answer: 'Yes. The free trial includes 1 campaign, 100 viewer sessions, AI question generation, and basic analytics. No credit card required. Upgrade when you need more campaigns or sessions.',
    },
    {
      id: 'item-9',
      question: 'Can I use Luma for employee training and compliance?',
      answer: 'Yes — this is one of our most popular use cases. You can verify that employees actually understood training content by checking their question responses, track completion rates per team, and export results for compliance audits.',
    },
    {
      id: 'item-10',
      question: 'How long does AI processing take?',
      answer: 'Typically 30-60 seconds for a 5-minute video. This includes transcription, question generation, and timestamp embedding. Longer videos (30+ minutes) may take 2-3 minutes. Pro and Enterprise plans get priority processing.',
    },
    {
      id: 'item-11',
      question: 'Can viewers skip questions?',
      answer: 'You control this per campaign. You can mark questions as required (video won\'t resume until answered) or optional (viewers can skip). You can also enable skip protection to prevent seeking past unanswered questions.',
    },
    {
      id: 'item-12',
      question: 'Do you offer refunds?',
      answer: 'All purchases are final. We offer a generous free tier so you can evaluate the platform before committing. You can cancel your subscription at any time — access continues until the end of your billing period.',
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 ring-muted dark:ring-0">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-dashed">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-muted-foreground mt-6 px-8">
            Can&apos;t find what you&apos;re looking for? Contact our{' '}
            <Link href="/support" className="text-primary font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
