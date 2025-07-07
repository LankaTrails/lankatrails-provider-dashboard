// Input Field Component Props
export interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'number';
    placeholder?: string;
    icon?: React.ReactNode;
    required?: boolean;
    className?: string;
}

export interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    className?: string;
}