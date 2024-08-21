/**
 * v0 by Vercel.
 * @see https://v0.dev/t/fPEdofv3zyp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [filters, setFilters] = useState({
    crimeType: [],
    dateRange: {
      start: null,
      end: null,
    },
    location: {
      state: null,
      city: null,
      zipCode: null,
    },
  })
  const [crimes, setCrimes] = useState([
    {
      id: 1,
      type: "Theft",
      date: "2023-04-15",
      location: {
        latitude: 40.73061,
        longitude: -73.935242,
      },
    },
    {
      id: 2,
      type: "Assault",
      date: "2023-05-01",
      location: {
        latitude: 40.718355,
        longitude: -74.007118,
      },
    },
    {
      id: 3,
      type: "Burglary",
      date: "2023-06-10",
      location: {
        latitude: 40.683455,
        longitude: -73.975141,
      },
    },
    {
      id: 4,
      type: "Theft",
      date: "2023-07-20",
      location: {
        latitude: 40.752137,
        longitude: -73.987806,
      },
    },
    {
      id: 5,
      type: "Assault",
      date: "2023-08-05",
      location: {
        latitude: 40.691032,
        longitude: -73.983749,
      },
    },
  ])
  const filteredCrimes = useMemo(() => {
    return crimes.filter((crime) => {
      if (filters.crimeType.length > 0 && !filters.crimeType.includes(crime.type)) {
        return false
      }
      if (filters.dateRange.start && filters.dateRange.end) {
        const crimeDate = new Date(crime.date)
        if (crimeDate < new Date(filters.dateRange.start) || crimeDate > new Date(filters.dateRange.end)) {
          return false
        }
      }
      if (filters.location.state || filters.location.city || filters.location.zipCode) {
        return true
      }
      return true
    })
  }, [crimes, filters])
  const crimeTypes = useMemo(() => {
    return [...new Set(crimes.map((crime) => crime.type))]
  }, [crimes])
  const crimeStats = useMemo(() => {
    const stats = {
      totalCrimes: filteredCrimes.length,
      mostCommonCrime: "",
      mostCommonCrimeCount: 0,
      highestCrimeRate: {
        location: {
          state: null,
          city: null,
          zipCode: null,
        },
        rate: 0,
      },
    }
    const crimeCountByType = filteredCrimes.reduce((acc, crime) => {
      if (acc[crime.type]) {
        acc[crime.type]++
      } else {
        acc[crime.type] = 1
      }
      return acc
    }, {})
    stats.mostCommonCrime = Object.keys(crimeCountByType).reduce((a, b) =>
      crimeCountByType[a] > crimeCountByType[b] ? a : b,
    )
    stats.mostCommonCrimeCount = crimeCountByType[stats.mostCommonCrime]
    const crimeCountByLocation = filteredCrimes.reduce((acc, crime) => {
      const key = `${crime.location.latitude},${crime.location.longitude}`
      if (acc[key]) {
        acc[key]++
      } else {
        acc[key] = 1
      }
      return acc
    }, {})
    const highestCrimeRate = Object.keys(crimeCountByLocation).reduce((a, b) => {
      const [aLat, aLon] = a.split(",").map(parseFloat)
      const [bLat, bLon] = b.split(",").map(parseFloat)
      const aRate = crimeCountByLocation[a]
      const bRate = crimeCountByLocation[b]
      if (bRate > aRate) {
        return b
      } else if (
        bRate === aRate &&
        haversineDistance(aLat, aLon, 40.73061, -73.935242) > haversineDistance(bLat, bLon, 40.73061, -73.935242)
      ) {
        return b
      } else {
        return a
      }
    }, Object.keys(crimeCountByLocation)[0])
    const [highestCrimeLatitude, highestCrimeLongitude] = highestCrimeRate.split(",").map(parseFloat)
    stats.highestCrimeRate = {
      location: {
        state: null,
        city: null,
        zipCode: null,
      },
      rate: crimeCountByLocation[highestCrimeRate],
    }
    return stats
  }, [filteredCrimes])
  const handleFilterChange = (type, value) => {
    setFilters((prevFilters) => {
      switch (type) {
        case "crimeType":
          return {
            ...prevFilters,
            crimeType: prevFilters.crimeType.includes(value)
              ? prevFilters.crimeType.filter((item) => item !== value)
              : [...prevFilters.crimeType, value],
          }
        case "dateRange":
          return {
            ...prevFilters,
            dateRange: {
              ...prevFilters.dateRange,
              [value.key]: value.value,
            },
          }
        case "location":
          return {
            ...prevFilters,
            location: {
              ...prevFilters.location,
              [value.key]: value.value,
            },
          }
        default:
          return prevFilters
      }
    })
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 p-8 bg-[#f56942]">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label>Crime Type</Label>
                <div className="grid gap-2 mt-2">
                  {crimeTypes.map((type) => (
                    <Label key={type} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.crimeType.includes(type)}
                        onCheckedChange={() => handleFilterChange("crimeType", type)}
                      />
                      {type}
                    </Label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Date Range</Label>
                <div className="grid gap-2 mt-2">
                  <Input
                    type="date"
                    value={filters.dateRange.start || ""}
                    onChange={(e) => handleFilterChange("dateRange", { key: "start", value: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end || ""}
                    onChange={(e) => handleFilterChange("dateRange", { key: "end", value: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <div className="grid gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="State"
                    value={filters.location.state || ""}
                    onChange={(e) => handleFilterChange("location", { key: "state", value: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="City"
                    value={filters.location.city || ""}
                    onChange={(e) => handleFilterChange("location", { key: "city", value: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="ZIP Code"
                    value={filters.location.zipCode || ""}
                    onChange={(e) => handleFilterChange("location", { key: "zipCode", value: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Crime Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <div className="text-2xl font-bold">{crimeStats.totalCrimes}</div>
                <div className="text-muted-foreground">Total Crimes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{crimeStats.mostCommonCrimeCount}</div>
                <div className="text-muted-foreground">Most Common Crime: {crimeStats.mostCommonCrime}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{crimeStats.highestCrimeRate.rate}</div>
                <div className="text-muted-foreground">
                  Highest Crime Rate: {crimeStats.highestCrimeRate.location.state},{" "}
                  {crimeStats.highestCrimeRate.location.city}, {crimeStats.highestCrimeRate.location.zipCode}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Crime Map</CardTitle>
            <Button variant="outline" className="ml-auto">
              Add Crime
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <div>
                {filteredCrimes.map((crime) => (
                  <div />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid grid-cols-3 gap-4">
              {crimeTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full ${filters.crimeType.includes(type) ? "bg-primary" : "bg-muted"}`}
                  />
                  <div>{type}</div>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}