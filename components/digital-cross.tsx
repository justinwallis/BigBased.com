import Image from "next/image"

export default function DigitalCross() {
  return (
    <div className="relative w-full h-full digital-cross-pulse">
      <Image src="/digitalcross.png" alt="Digital Cross" fill style={{ objectFit: "contain" }} priority />
    </div>
  )
}
