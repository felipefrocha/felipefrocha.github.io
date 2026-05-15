import { SkillTag } from '../atoms/SkillTag';

export default function SkillTagExample() {
  const skills = ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'];
  
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <SkillTag key={skill} skill={skill} />
      ))}
    </div>
  );
}
