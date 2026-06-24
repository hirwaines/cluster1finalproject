import { Building2, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../context/AppContext';

interface DepartmentSelectorProps {
  value: string;
  onChange: (value: string) => void;
  showAllOption?: boolean;
  label?: string;
}

export function DepartmentSelector({
  value,
  onChange,
  showAllOption = true,
  label = 'Department'
}: DepartmentSelectorProps) {
  const { researchers } = useApp();

  // Get unique departments from researchers
  const departments = Array.from(
    new Set(researchers.map(r => r.department).filter(Boolean))
  ).sort();

  return (
    <div className="flex items-center gap-2">
      <Building2 className="w-5 h-5 text-gray-500" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">All Departments</SelectItem>
          )}
          {departments.map(dept => (
            <SelectItem key={dept} value={dept || ''}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
