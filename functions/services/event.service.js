import User from '../schemas/user.schema.js';

export default async function eventController(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get current date and calculate next 30 days
 
      const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    nextMonth.setHours(23, 59, 59, 999); // End of day

    // Format date for display (e.g., "Jul 20")
    const formatDisplayDate = (date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    };

    // Get birthdays
   // Get birthdays for current month
    const birthdays = await User.aggregate([
      {
        $match: {
          dob: { $ne: null, $exists: true },
          status: true,
        },
      },
      {
        $addFields: {
          // Calculate next birthday in current year
          nextBirthday: {
            $dateFromParts: {
              year: today.getFullYear(),
              month: { $month: "$dob" },
              day: { $dayOfMonth: "$dob" }
            }
          },
          // Calculate age (current year - birth year)
          age: {
            $subtract: [
              today.getFullYear(),
              { $year: "$dob" }
            ]
          }
        }
      },
      {
        $match: {
          nextBirthday: {
            $gte: monthStart,
            $lte: monthEnd
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: { $concat: ["$firstName", " ", "$lastName"] },
          department: 1,
          date: "$nextBirthday",
          month: { $month: "$nextBirthday" },
          day: { $dayOfMonth: "$nextBirthday" },
          years: "$age",
          profilePic: "$userImg",
          eventType: "birthday",
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Get work anniversaries
  const anniversaries = await User.aggregate([
      {
        $match: {
          joinDate: { $ne: null, $exists: true },
          status: true,
        },
      },
      {
        $addFields: {
          // Calculate next anniversary in current year
          nextAnniversary: {
            $dateFromParts: {
              year: today.getFullYear(),
              month: { $month: "$joinDate" },
              day: { $dayOfMonth: "$joinDate" }
            }
          },
          // Calculate years of service (current year - join year)
          yearsOfService: {
            $subtract: [
              today.getFullYear(),
              { $year: "$joinDate" }
            ]
          }
        }
      },
      {
        $match: {
          nextAnniversary: {
            $gte: monthStart,
            $lte: monthEnd
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: { $concat: ["$firstName", " ", "$lastName"] },
          department: 1,
          date: "$nextAnniversary",
          month: { $month: "$nextAnniversary" },
          day: { $dayOfMonth: "$nextAnniversary" },
          years: "$yearsOfService",
          profilePic: "$userImg",
          eventType: "anniversary",
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Format dates in JavaScript instead of MongoDB
    const formatEvents = (events) => {
      return events.map(event => {
        const date = new Date(event.date);
        return {
          ...event,
          date: date.toISOString(),
          formattedDate: formatDisplayDate(date)
        };
      });
    };

    const formattedBirthdays = formatEvents(birthdays);
    const formattedAnniversaries = formatEvents(anniversaries);

    res.status(200).json({
      success: true,
      data: {
        birthdays: {
          count: formattedBirthdays.length,
          events: formattedBirthdays
        },
        anniversaries: {
          count: formattedAnniversaries.length,
          events: formattedAnniversaries
        },
        total: formattedBirthdays.length + formattedAnniversaries.length
      }
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
}