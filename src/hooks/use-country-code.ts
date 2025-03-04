import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { countryToCode, codeToCountry, ClientFormValues } from "@/lib/schemas/client-schema";

export function useCountryCode(form: UseFormReturn<ClientFormValues>) {
  const [countryCode, setCountryCode] = useState("");

  // Initialize country code from phone number or country
  useEffect(() => {
    const phoneNumber = form.getValues("phoneNumber");
    const codeMatch = phoneNumber.match(/^\+\d+/);
    
    if (codeMatch?.[0] && codeToCountry[codeMatch[0]]) {
      setCountryCode(codeMatch[0]);
    } else {
      const country = form.getValues("country");
      if (country && countryToCode[country]) {
        setCountryCode(countryToCode[country]);
      }
    }
  }, []);

  // Update country code when country changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "country") {
        const country = value.country;
        if (country && countryToCode[country]) {
          setCountryCode(countryToCode[country]);
          
          // Update phone number with new country code
          const phoneNumber = form.getValues("phoneNumber") ?? "";
          const phoneWithoutCode = phoneNumber.replace(/^\+\d+\s*/, "");
          form.setValue("phoneNumber", countryToCode[country] + " " + phoneWithoutCode);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Extract country code from phone number
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "phoneNumber") {
        const phoneNumber = value.phoneNumber ?? "";
        const codeMatch = phoneNumber.match(/^\+\d+/);
        
        if (codeMatch?.[0] && codeToCountry[codeMatch[0]]) {
          setCountryCode(codeMatch[0]);
          
          // Update country if it doesn't match the phone code
          const currentCountry = form.getValues("country");
          const matchingCountry = codeToCountry[codeMatch[0]];
          if (currentCountry !== matchingCountry) {
            form.setValue("country", matchingCountry);
          }
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle country code change
  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
    
    // Update phone number with new country code
    const phoneNumber = form.getValues("phoneNumber") ?? "";
    const phoneWithoutCode = phoneNumber.replace(/^\+\d+\s*/, "");
    form.setValue("phoneNumber", code + " " + phoneWithoutCode);
    
    // Update country field based on selected country code
    if (code && codeToCountry[code]) {
      form.setValue("country", codeToCountry[code]);
    }
  };

  return {
    countryCode,
    handleCountryCodeChange
  };
}
