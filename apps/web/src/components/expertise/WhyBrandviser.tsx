/** Expertise: the four reasons to choose BRANDVISER, in four columns on desktop and a list on mobile. */
const REASONS = [
  {
    title: 'Borderless Creativity',
    text: 'Bold ideas. Exceptional experiences. Meaningful impact.',
  },
  {
    title: '360° Execution',
    text: 'From high-precision print and MICE to end-to-end BTL activations.',
  },
  {
    title: 'Pan-India Reach',
    text: 'Seamless execution across 400+ cities, with an international presence in 15+ countries.',
  },
  {
    title: 'One Partner. Every Possibility.',
    text: 'One trusted team for strategy, production, and flawless on-ground delivery.',
  },
];

export function WhyBrandviser() {
  return (
    <ul className="grid gap-4 md:grid-cols-4 md:gap-6">
      {REASONS.map((reason) => (
        <li
          key={reason.title}
          className="flex flex-col gap-1 border-t border-rule pt-4 md:gap-2 md:border-gold-500 md:pt-6"
        >
          <h3 className="text-h3">{reason.title}</h3>
          <p className="text-small text-slate">{reason.text}</p>
        </li>
      ))}
    </ul>
  );
}
