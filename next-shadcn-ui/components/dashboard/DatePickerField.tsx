"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  birthdate?: boolean
  disabled?: boolean
}

export function DatePickerField({
  value,
  onChange,
  placeholder,
  birthdate = false,
  disabled = false,
}: DatePickerFieldProps) {
  const selected = value ? parseISO(value) : undefined
  const today = new Date()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-start font-normal"
        >
          <CalendarIcon data-icon="inline-start" />
          {selected
            ? format(selected, "PPP", { locale: es })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
          captionLayout={birthdate ? "dropdown" : "label"}
          startMonth={birthdate ? new Date(1940, 0) : today}
          endMonth={birthdate ? today : new Date(today.getFullYear() + 3, 11)}
          disabled={birthdate ? { after: today } : { before: today }}
          locale={es}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
