export interface StudentStory {
  id: number
  name: string
  role: string
  university: string
  image: string
  story: string
  body: string[]
  highlights: string[]
  joinedYear: string
  achievement: string
  quote: string
}

export const storiesData: StudentStory[] = [
  {
    id: 1,
    name: "Fatima Rahman",
    role: "Computer Science Student",
    university: "University of Dhaka",
    image: "/images/emergency-tran-bitoron-activities-3.jpg",
    story:
      "Student Square helped me develop leadership skills through their community programs. I learned how to organize events and work with diverse teams.",
    body: [
      "Before joining Student Square, Fatima describes herself as “the student who always sat in the back of the room.” She had top grades and a clear interest in computer science, but speaking in groups, raising her hand, or volunteering for anything beyond coursework felt impossibly hard. A friend invited her to a weekend leadership workshop run by Student Square in her second semester at Dhaka University — and that single weekend, she says, “quietly rearranged how I saw myself.”",
      "The workshop paired soft-skill training (active listening, structured feedback, basic facilitation) with a small live project: each team had to plan and run a one-day community activity within four weeks. Fatima's group chose a coding bootcamp for girls from a nearby low-income school. She volunteered — surprising herself — to lead the curriculum design. “I knew I could code. I didn't know I could teach. I really didn't know I could stand in front of a room of strangers and explain a `for` loop without my voice shaking.”",
      "Over the next eighteen months Fatima led three community projects through Student Square: the coding bootcamp she started, a campus mental-health awareness week, and an emergency relief drive after monsoon flooding in her home district. Each time she took on a slightly bigger leadership role — from curriculum lead to logistics coordinator to overall project director. Her university faculty noticed, and she was nominated to represent the department at the national inter-university leadership conference last year.",
      "Today she mentors first-year students through Student Square's peer leadership track. Her message to them is simple: “You don't grow into leadership by reading about it. You grow by doing one small uncomfortable thing, and then the next, and then the next. Student Square gave me a safe place to do those uncomfortable things until they stopped being uncomfortable.”",
    ],
    highlights: [
      "Designed and ran a free coding bootcamp for 24 girls from underserved schools",
      "Coordinated emergency relief reaching 180+ families during the 2023 monsoon floods",
      "Now mentors first-year students through the peer leadership programme",
    ],
    joinedYear: "2022",
    achievement: "Led 3 successful community projects",
    quote: "Student Square transformed me from a shy student into a confident leader.",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    role: "Engineering Student",
    university: "BUET",
    image: "/images/emergency-tran-bitoron-activities.jpg",
    story:
      "Through Student Square's emergency training programs, I gained practical skills that helped me assist during natural disasters in my community.",
    body: [
      "Ahmed grew up in a low-lying district in Kurigram, where the question is never *if* the floods will come but *when*. His earliest memories include his father lifting furniture onto bamboo platforms and the family moving to higher ground for weeks at a time. When he reached BUET to study civil engineering, he carried with him a quiet conviction: he wanted his work to actually matter for places like the one he came from.",
      "Student Square's emergency preparedness training programme was, in his words, “the first time anyone took the question seriously and gave me something practical to do about it.” Over a twelve-week course run with partners from local health clinics and disaster-response NGOs, he learned first aid, evacuation logistics, water purification, safe shelter assessment, and how to coordinate volunteers under stress. The training combined classroom sessions with three full-scale simulation weekends in the field.",
      "When monsoon flooding hit Kurigram last August, Ahmed didn't wait for instructions. He travelled home, helped his local Student Square chapter set up a coordination point at the community college, and spent eleven days running relief logistics — distributing food, clean water, and basic medical supplies to families cut off by rising water. The work was exhausting and emotionally heavy, but the training meant he and his team knew exactly what to do and in what order.",
      "He is now certified as an Emergency Response Volunteer and helps Student Square design the next iteration of the training programme — pushing for more focus on mental-health support for volunteers themselves, an aspect he says they all underestimated. “You can teach someone to set up a shelter in two days. Teaching them how to keep going when they see the same family lose everything again next year — that takes longer.”",
    ],
    highlights: [
      "Completed 12-week certified Emergency Response training",
      "Led on-the-ground relief during the 2024 Kurigram floods, reaching 200+ households",
      "Helps redesign Student Square's volunteer mental-health support curriculum",
    ],
    joinedYear: "2021",
    achievement: "Certified Emergency Response Volunteer",
    quote: "The training I received here saved lives during the recent flood.",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Environmental Science Student",
    university: "Jahangirnagar University",
    image: "/images/relation-will-be-cooperative-for-social-building.jpg",
    story:
      "Student Square's environmental initiatives inspired me to start my own tree plantation project. I've planted over 500 trees in my district.",
    body: [
      "Nusrat's interest in environmental science began with a single bad summer. The year she sat her HSC exams was the year her village's main pond dried completely for the first time in living memory. Older relatives blamed the weather. She started reading and realised the weather was only part of the story — falling groundwater, deforestation, and decades of shortsighted land use were all colliding at once.",
      "She enrolled at Jahangirnagar University determined to do something concrete, but found herself overwhelmed by how abstract academic environmentalism could feel. Student Square's Counter Climate Change Project gave her a different way in. The programme didn't start with policy or theory — it started with seedlings, soil, and the small, tangible task of getting a palm sapling into the ground and keeping it alive for twelve months.",
      "Inspired, Nusrat returned home during her winter break with a proposal for her district's local council: a community-led palm plantation drive. With Student Square providing seedlings, training, and a follow-up monitoring framework, she recruited 35 volunteers from local schools and colleges. They planted 200 saplings in the first year. With each subsequent year more volunteers joined, and Nusrat is now overseeing the fourth annual planting. Total saplings planted to date: 512. Survival rate at twelve months: 87% — well above the national average for similar drives.",
      "Beyond the trees themselves, she counts the change in conversation as the biggest impact. “Three years ago no one in my village talked about groundwater levels. Now the chairman raises it at every monthly meeting. That kind of shift is what I really care about — not just planting trees but changing what people pay attention to.”",
    ],
    highlights: [
      "Founded an annual community plantation drive in her home district",
      "Personally led the planting of 512 palm saplings (87% twelve-month survival rate)",
      "Recognised with the Environmental Conservation Award by her university",
    ],
    joinedYear: "2022",
    achievement: "Environmental Conservation Award Winner",
    quote: "Student Square showed me that one person can make a real difference.",
  },
  {
    id: 4,
    name: "Karim Uddin",
    role: "Psychology Student",
    university: "University of Chittagong",
    image: "/images/student-square-16th-group-counselling-workshop-godagari-rajshahi.jpg",
    story:
      "The counseling workshops at Student Square helped me understand mental health better. Now I volunteer to help other students with their struggles.",
    body: [
      "Karim came to Student Square for selfish reasons, as he openly admits. He had been struggling silently with anxiety through his first year at Chittagong University — sleep problems, racing thoughts, a creeping sense that he couldn't actually cope with the workload he had been so confident about as a school student. He saw a flyer for a group counselling session and went, mostly hoping that no one would recognise him.",
      "What he found in that first session changed his trajectory in two ways. First, he discovered that almost every other student in the room was carrying something similar, and that simply naming what he was feeling cut its weight roughly in half. Second, he discovered that he was genuinely interested in *how* the facilitators worked — how they created safety, how they handled silence, how they let people sit with difficult feelings without rushing to fix anything.",
      "He attended every session offered to him over the next two semesters and then asked if he could train as a peer supporter. Student Square's peer support pathway is intentionally slow — six months of training and shadowing before a peer leader runs sessions on their own — and Karim went through it with an intensity his trainers still describe with admiration. He has now co-facilitated more than thirty group sessions and is the first point of contact for new students experiencing mental-health distress in his hall of residence.",
      "He has also changed direction academically. Originally aiming for a career in HR, Karim is now planning a Master's in clinical psychology, with a focus on adolescent and young-adult mental health. “The thing about doing this work,” he says, “is that it doesn't let you stay neutral about your own life. You can't sit with someone else's pain and not look at your own. Student Square didn't just teach me to support others. It made me a better friend to myself.”",
    ],
    highlights: [
      "Trained for six months on Student Square's peer-support pathway",
      "Co-facilitated 30+ group counselling sessions",
      "Changed academic direction toward clinical psychology after his work with the programme",
    ],
    joinedYear: "2022",
    achievement: "Mental Health Advocate",
    quote: "Student Square taught me the importance of supporting others' mental wellbeing.",
  },
  {
    id: 5,
    name: "Rashida Begum",
    role: "Education Student",
    university: "Rajshahi University",
    image: "/images/brain-battle-prize-ceremony.jpg",
    story:
      "Student Square's educational programs helped me develop teaching skills. I now volunteer at local schools and help underprivileged children learn.",
    body: [
      "Rashida is the first woman in her family to attend university. Her father, a farmer in a small village outside Rajshahi, supported her decision against the advice of most of his relatives — and Rashida arrived at Rajshahi University determined not to waste the privilege. She enrolled in Education, partly because teaching seemed practical, and partly because the schools in her own community had been so under-resourced that she wanted to be part of changing that.",
      "Student Square's classroom-skills workshops gave her something her formal degree didn't: practice. Real classrooms, real children, real teaching plans she had to write and defend, real feedback from experienced facilitators. She remembers her first solo lesson — a session on basic Bangla grammar for twelve children aged 7 to 10 — as “the hardest forty-five minutes of my life and also the moment I knew I'd chosen the right career.”",
      "Over three years she has now run weekly study sessions in two community learning centres in peri-urban Rajshahi, focusing on children whose parents are migrant workers or who would otherwise drop behind during the school year. She has experimented with reading circles, storytelling, simple project-based maths, and a quiet attendance-tracking system that flags children at risk of dropping out so she can speak to their parents early.",
      "Her measurable impact, by the centres' own reporting, includes a marked drop in absenteeism among the children she works with and noticeable improvements in their Bangla reading levels. Rashida is more interested in the harder-to-measure changes: parents asking her about secondary school options for their daughters, children volunteering to read aloud who would never have done so before, an older girl in the village now planning to apply to university herself. “Education,” she says, “is one of the few things you can give somebody that they can never have taken away again.”",
    ],
    highlights: [
      "Runs weekly study sessions in two community learning centres",
      "Direct teaching has reduced absenteeism among her students by a measurable margin",
      "Plans to open a community learning centre in her home village after graduating",
    ],
    joinedYear: "2021",
    achievement: "Community Education Volunteer",
    quote: "Student Square helped me discover my passion for teaching and community service.",
  },
  {
    id: 6,
    name: "Mohammad Ali",
    role: "Business Administration Student",
    university: "North South University",
    image: "/images/student-square-one-minute-investment-project-2.jpg",
    story:
      "Through Student Square's entrepreneurship programs, I learned business skills and started my own small business. I now employ 5 local people.",
    body: [
      "Mohammad always wanted to start something of his own, but for most of his adolescence the idea of “something” was a vague mixture of family expectation and Instagram inspiration. It wasn't until he joined Student Square's One Minute Investment Project that he encountered a framework that actually translated “wanting to start a business” into something he could do on a Tuesday afternoon.",
      "The One Minute Investment Project's premise is simple and unusual: invest a small, sustained amount of time and resources into a single chosen initiative, and let consistency compound. Mohammad chose to spend his minute — literally, his first 60 seconds of work each morning — on customer outreach for a small handmade-leather goods idea he had been quietly toying with. Over six months that compounded into a proper customer list, a small online storefront, and his first paying orders.",
      "What turned the side project into a real business was the structured mentorship Student Square paired with the programme. Twice a month he met with a working entrepreneur for one hour. Those sessions covered the practical things business courses often skip: how to register a small business, how to read a basic profit-and-loss statement, how to handle a difficult customer, how to decide whether to take on a co-founder. Mohammad's business now operates from a small workshop in Dhaka and employs five people, all from his original neighbourhood.",
      "He is careful about how he describes success. “Five jobs is not a lot in the grand scheme of things,” he says. “But for those five people and their families, those jobs change everything. And the discipline I learned through Student Square — the idea that consistency beats inspiration — is something I now teach the team. We are building this slowly. Slowly is fine.”",
    ],
    highlights: [
      "Founded a handmade-leather goods business that now employs 5 people locally",
      "Mentored through Student Square's One Minute Investment Project framework",
      "Now serves as a mentor himself for incoming entrepreneurship cohort members",
    ],
    joinedYear: "2020",
    achievement: "Young Entrepreneur Award",
    quote: "Student Square gave me the confidence and skills to become an entrepreneur.",
  },
]
