const marqueeSkills = [
  "Python",
  "JavaScript",
  "React",
  "HTML5",
  "CSS3",
  "SQL",
  "MongoDB",
  "Git",
  "GitHub",
  "Java",
  "C",
  "C++",
  "VS Code",
];

export default function SkillMarquee() {
  // Duplicate the list for seamless infinite loop
  const duplicated = [...marqueeSkills, ...marqueeSkills];

  return (
    <div className="relative isolate mt-16 w-full">
      {/* Soft radial blue glow behind the container */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Main marquee container */}
      <div
        className="skill-marquee-container group relative overflow-hidden rounded-[28px] border border-[#242424] bg-[#0B0B0B]"
        style={{
          padding: "20px 24px",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
        }}
      >
        {/* Fade mask wrapper */}
        <div
          className="flex overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          {/* Animated track — pauses on container hover */}
          <div className="skill-marquee-track flex shrink-0 items-center">
            {duplicated.map((skill, i) => (
              <div
                key={`${skill}-${i}`}
                className="skill-pill group/pill"
              >
                {/* Glowing blue dot */}
                <span className="skill-dot" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
