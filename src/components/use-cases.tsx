import { Package, GraduationCap, MessageCircle, ClipboardList, Megaphone, Users } from 'lucide-react'

const useCases = [
  {
    icon: Package,
    title: 'Product Validation',
    description: 'Test product concepts with real users. Embed questions during demos to capture instant feedback at the moment of highest engagement.',
    tag: 'Product Teams',
  },
  {
    icon: GraduationCap,
    title: 'Employee Training',
    description: 'Verify comprehension during onboarding and compliance videos. Auto-generate quizzes that ensure your team actually learned the material.',
    tag: 'HR & L&D',
  },
  {
    icon: MessageCircle,
    title: 'Customer Feedback',
    description: 'Replace post-video surveys with in-video questions. Capture feedback while context is fresh — not 3 days later via email.',
    tag: 'CX Teams',
  },
  {
    icon: ClipboardList,
    title: 'Interactive Surveys',
    description: 'Transform boring form-based surveys into engaging video experiences. Higher completion rates, richer insights.',
    tag: 'Research',
  },
  {
    icon: Megaphone,
    title: 'Marketing Research',
    description: 'Test messaging, creative concepts, and ad effectiveness by embedding questions directly into video content before launch.',
    tag: 'Marketing',
  },
  {
    icon: Users,
    title: 'Education & E-Learning',
    description: 'Create interactive course content where students prove understanding in real-time. AI adapts question difficulty automatically.',
    tag: 'Educators',
  },
]

export default function UseCases() {
  return (
    <section className="py-16 md:py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-balance text-3xl font-semibold lg:text-4xl">Built for every team</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">One platform, unlimited use cases. See how teams use Luma to drive engagement and collect insights.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
            >
              
              <span className="absolute top-4 right-4 text-[10px] font-medium text-muted-foreground bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
                {uc.tag}
              </span>

              
              <div className="size-10 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/[0.12] flex items-center justify-center mb-4 group-hover:bg-emerald-500/[0.12] transition-colors">
                <uc.icon size={18} className="text-emerald-400" />
              </div>

              
              <h3 className="font-medium text-foreground mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{uc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
