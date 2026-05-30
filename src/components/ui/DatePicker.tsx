import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({
  value,
  onChange,
  placeholder,
  className,
  birthday,
}: {
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: string
  className?: string
  birthday?: boolean
  recent?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12 text-[14px] px-4",
            "border border-cream/15 bg-cream/[0.04] text-cream",
            "rounded-none hover:border-gold/40 hover:bg-cream/[0.06] transition-all duration-300",
            "focus:border-gold/50 focus:ring-1 focus:ring-gold/20",
            "placeholder:text-cream-muted/30",
            !value && "text-cream-muted/30",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gold/60" />
          {value ? (
            <span className="font-mono text-[12px] tracking-wide">
              {format(value, "PPP", { locale: es })}
            </span>
          ) : (
            <span>{placeholder || "Selecciona una fecha"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 border border-cream/15 rounded-none",
          "bg-dark-primary shadow-2xl",
          "[&>*]:bg-dark-primary",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "[--ring:0]"
        )}
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            if (!birthday) setOpen(false)
          }}
          initialFocus
          className="p-3"
          captionLayout={birthday ? "dropdown" : "label"}
          fromYear={birthday ? 1950 : undefined}
          toYear={birthday ? new Date().getFullYear() : undefined}
          defaultMonth={birthday ? new Date(new Date().getFullYear() - 25, 0, 1) : undefined}
          classNames={{
            root: "w-fit",
            months: "flex gap-4 flex-col md:flex-row relative",
            month: "flex flex-col w-full gap-4",
            nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
            button_previous: cn(
              "size-8 flex items-center justify-center text-cream-muted hover:text-gold",
              "hover:bg-gold/10 transition-colors duration-200",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            ),
            button_next: cn(
              "size-8 flex items-center justify-center text-cream-muted hover:text-gold",
              "hover:bg-gold/10 transition-colors duration-200",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            ),
            month_caption: "flex items-center justify-center h-8 w-full px-8",
            dropdowns: "w-full flex items-center text-[13px] font-mono justify-center h-8 gap-1.5",
            dropdown_root: cn(
              "relative has-focus:border-gold/40 border border-cream/15 rounded-none",
              "has-focus:ring-1 has-focus:ring-gold/20 bg-dark-primary"
            ),
            dropdown: "absolute bg-dark-primary inset-0 opacity-0 cursor-pointer",
            caption_label: cn(
              "select-none font-mono text-[13px] tracking-wide",
              birthday
                ? "rounded-none px-2 pr-1 flex items-center gap-1 text-cream h-8 border border-cream/15 hover:border-gold/40 transition-colors"
                : "text-cream"
            ),
            table: "w-full border-collapse",
            weekdays: "flex",
            weekday: cn(
              "text-cream-muted/50 font-mono text-[9px] uppercase tracking-[0.15em]",
              "rounded-none flex-1 font-normal select-none"
            ),
            week: "flex w-full mt-1.5",
            day: cn(
              "relative w-full h-full p-0 text-center",
              "aspect-square select-none"
            ),
            range_start: "rounded-none bg-gold/20",
            range_middle: "rounded-none",
            range_end: "rounded-none bg-gold/20",
            today: cn(
              "text-gold font-bold ring-1 ring-gold/30",
              "data-[selected=true]:ring-0"
            ),
            outside: "text-cream-muted/20",
            disabled: "text-cream-muted/20 opacity-50",
            hidden: "invisible",
          }}
          components={{
            Root: ({ className, rootRef, ...props }) => (
              <div
                data-slot="calendar"
                ref={rootRef}
                className={cn("bg-dark-primary", className)}
                {...props}
              />
            ),
            Chevron: ({ orientation, className, ...props }) => {
              if (orientation === "left") {
                return <ChevronLeft className={cn("size-4 text-cream-muted/50 hover:text-gold transition-colors", className)} {...props} />
              }
              if (orientation === "right") {
                return <ChevronRight className={cn("size-4 text-cream-muted/50 hover:text-gold transition-colors", className)} {...props} />
              }
              return <ChevronDown className={cn("size-4 text-cream-muted/50 hover:text-gold transition-colors", className)} {...props} />
            },
            DayButton: ({ className, day, modifiers, ...props }) => (
              <button
                data-day={day.date.toLocaleDateString()}
                data-selected-single={
                  modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
                }
                className={cn(
                  "w-full h-full p-0 text-[13px] font-mono",
                  "aspect-square flex items-center justify-center",
                  "transition-all duration-150 ease-out",
                  "text-cream/70 hover:text-cream",
                  "hover:bg-cream/[0.06]",
                  "data-[selected-single=true]:bg-gold data-[selected-single=true]:text-dark-primary",
                  "data-[selected-single=true]:font-bold data-[selected-single=true]:shadow-[0_0_12px_rgba(200,178,107,0.25)]",
                  "data-[range-middle=true]:bg-gold/15 data-[range-middle=true]:text-cream",
                  "data-[range-start=true]:bg-gold data-[range-start=true]:text-dark-primary data-[range-start=true]:font-bold",
                  "data-[range-end=true]:bg-gold data-[range-end=true]:text-dark-primary data-[range-end=true]:font-bold",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50",
                  "[&>span]:text-[9px] [&>span]:opacity-50",
                  className
                )}
                {...props}
              />
            ),
            WeekNumber: ({ children, ...props }) => (
              <td {...props}>
                <div className="flex size-8 items-center justify-center text-center">
                  {children}
                </div>
              </td>
            ),
          }}
          {...(birthday ? {} : { showOutsideDays: false })}
        />
      </PopoverContent>
    </Popover>
  )
}
