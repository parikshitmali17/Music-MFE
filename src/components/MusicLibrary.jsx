


"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Container,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Slide,
  TextField,
  Grid,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Autocomplete,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  MusicNote as MusicNoteIcon,
  Album as AlbumIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  Logout as LogoutIcon,
  Group as GroupIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const MusicLibrary = ({ user = { role: "user" }, onLogout }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const audioRef = useRef(null)

  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      duration: "3:07",
      genre: "Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 2,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: "5:55",
      genre: "Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 3,
      title: "Let it Be",
      artist: "The Beatles",
      album: "Let it Be",
      duration: "4:03",
      genre: "Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 4,
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      duration: "6:30",
      genre: "Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 5,
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      duration: "8:02",
      genre: "Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 6,
      title: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      duration: "4:54",
      genre: "Pop",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 7,
      title: "Like a Rolling Stone",
      artist: "Bob Dylan",
      album: "Highway 61 Revisited",
      duration: "6:13",
      genre: "Folk Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 8,
      title: "What's Going On",
      artist: "Marvin Gaye",
      album: "What's Going On",
      duration: "3:53",
      genre: "Soul",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 9,
      title: "Hey Jude",
      artist: "The Beatles",
      album: "Hey Jude",
      duration: "7:11",
      genre: "Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 10,
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      album: "Nevermind",
      duration: "5:01",
      genre: "Grunge",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 11,
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      duration: "5:03",
      genre: "Hard Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
    {
      id: 12,
      title: "Purple Haze",
      artist: "Jimi Hendrix",
      album: "Are You Experienced",
      duration: "2:50",
      genre: "Psychedelic Rock",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    },
  ])

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    songId: null,
    songTitle: "",
  })

  const [addDialog, setAddDialog] = useState({
    open: false,
  })

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
    genre: "",
    audioUrl: "",
  })

  const [currentPlaying, setCurrentPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Search and Filter States
  const [globalSearch, setGlobalSearch] = useState("")
  const [searchField, setSearchField] = useState("all")
  const [filterBy, setFilterBy] = useState("")
  const [filterValue, setFilterValue] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [groupBy, setGroupBy] = useState("")

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentPlaying(null)
      setCurrentTime(0)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentPlaying])

  const handlePlayPause = async (song) => {
    const audio = audioRef.current
    if (!audio) return

    // Same track → toggle play / pause
    if (currentPlaying?.id === song.id) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        try {
          await audio.play()
          setIsPlaying(true)
        } catch (err) {
          /* ignore AbortError or any user-gesture errors */
        }
      }
      return
    }

    // Different track → stop current, load new, then play
    audio.pause() // 1️⃣ ensure previous play() settles
    audio.currentTime = 0 // reset position
    setIsPlaying(false)
    setCurrentPlaying(song) // update UI first
    audio.src = song.audioUrl

    try {
      await audio.play() // 2️⃣ begin playback
      setIsPlaying(true)
    } catch (err) {
      /* ignore AbortError or user-gesture errors */
    }
  }

  const handleAddSong = () => {
    setAddDialog({ open: true })
  }

  const handleAddSongSubmit = () => {
    if (formData.title && formData.artist && formData.album) {
      const newSong = {
        id: Date.now(),
        title: formData.title,
        artist: formData.artist,
        album: formData.album,
        duration: formData.duration || "0:00",
        genre: formData.genre || "Unknown",
        audioUrl: formData.audioUrl || "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      }

      setSongs((prevSongs) => [...prevSongs, newSong])
      setAddDialog({ open: false })
      setFormData({
        title: "",
        artist: "",
        album: "",
        duration: "",
        genre: "",
        audioUrl: "",
      })
    }
  }

  const handleAddSongCancel = () => {
    setAddDialog({ open: false })
    setFormData({
      title: "",
      artist: "",
      album: "",
      duration: "",
      genre: "",
      audioUrl: "",
    })
  }

  const handleFormChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleDeleteClick = (song) => {
    setDeleteDialog({
      open: true,
      songId: song.id,
      songTitle: song.title,
    })
  }

  const handleDeleteConfirm = () => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== deleteDialog.songId))
    setDeleteDialog({ open: false, songId: null, songTitle: "" })

    // Stop playing if the deleted song is currently playing
    if (currentPlaying?.id === deleteDialog.songId) {
      setCurrentPlaying(null)
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, songId: null, songTitle: "" })
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  const getAvatarColor = (index) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]
    return colors[index % colors.length]
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Global search function - searches across all fields
  const getGlobalSearchResults = () => {
    if (!globalSearch.trim()) return songs

    const searchTerm = globalSearch.toLowerCase().trim()

    return songs.filter((song) => {
      if (searchField === "all") {
        // Search across all fields
        return (
          song.title?.toLowerCase().includes(searchTerm) ||
          song.artist?.toLowerCase().includes(searchTerm) ||
          song.album?.toLowerCase().includes(searchTerm) ||
          song.genre?.toLowerCase().includes(searchTerm) ||
          song.duration?.toLowerCase().includes(searchTerm)
        )
      } else {
        // Search in specific field
        const fieldValue = song[searchField]?.toString().toLowerCase() || ""
        return fieldValue.includes(searchTerm)
      }
    })
  }

  // Enhanced filter function with better string matching
  const getFilteredSongs = (songsToFilter) => {
    if (!filterBy || !filterValue || !filterValue.trim()) return songsToFilter

    return songsToFilter.filter((song) => {
      const fieldValue = song[filterBy]?.toString().toLowerCase() || ""
      const searchValue = filterValue.toString().toLowerCase().trim()
      return fieldValue.includes(searchValue)
    })
  }

  // Enhanced sort function with better type handling
  const getSortedSongs = (songsToSort) => {
    if (!sortBy) return songsToSort

    return [...songsToSort].sort((a, b) => {
      let aValue = a[sortBy]?.toString().toLowerCase() || ""
      let bValue = b[sortBy]?.toString().toLowerCase() || ""

      // Special handling for duration sorting
      if (sortBy === "duration") {
        const parseTime = (timeStr) => {
          const [minutes, seconds] = timeStr.split(":").map(Number)
          return minutes * 60 + seconds
        }
        aValue = parseTime(a[sortBy] || "0:00")
        bValue = parseTime(b[sortBy] || "0:00")

        if (sortOrder === "asc") {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      }

      // String comparison for other fields
      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })
  }

  // Group function
  const getGroupedSongs = (songsToGroup) => {
    if (!groupBy) return { "All Songs": songsToGroup }

    return songsToGroup.reduce((groups, song) => {
      const groupKey = song[groupBy] || "Unknown"
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(song)
      return groups
    }, {})
  }

  // Process songs through search, filter, sort, and group
  const processedSongs = () => {
    const searched = getGlobalSearchResults()
    const filtered = getFilteredSongs(searched)
    const sorted = getSortedSongs(filtered)
    return getGroupedSongs(sorted)
  }

  // Clear all filters and search
  const handleClearAll = () => {
    setGlobalSearch("")
    setSearchField("all")
    setFilterBy("")
    setFilterValue("")
    setSortBy("")
    setSortOrder("asc")
    setGroupBy("")
  }

  // Get unique values for autocomplete
  const getUniqueValues = (field) => {
    return [...new Set(songs.map((song) => song[field]).filter(Boolean))]
  }

  // Get search suggestions based on current search field
  const getSearchSuggestions = () => {
    if (searchField === "all") {
      // Return a mix of all field values
      const allValues = [
        ...getUniqueValues("title"),
        ...getUniqueValues("artist"),
        ...getUniqueValues("album"),
        ...getUniqueValues("genre"),
      ]
      return [...new Set(allValues)]
    } else {
      return getUniqueValues(searchField)
    }
  }

  // Add these handler functions after the existing handlers
  const handleFilterByChange = (event) => {
    setFilterBy(event.target.value)
    setFilterValue("") // Clear filter value when changing filter field
  }

  const handleFilterValueChange = (event, newValue) => {
    setFilterValue(newValue || "")
  }

  const handleSortByChange = (event) => {
    setSortBy(event.target.value)
  }

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value)
  }

  const handleGroupByChange = (event) => {
    setGroupBy(event.target.value)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <audio ref={audioRef} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            🎵 Music Library
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your personal collection of amazing tracks
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  Total Songs: {songs.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Welcome back, {user?.name || "Music Lover"}!
                  <Chip
                    label={user?.role?.toUpperCase() || "USER"}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: user?.role === "admin" ? "#ff6b6b" : "#4ecdc4",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MusicNoteIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                <Button
                  variant="contained"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.3)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.3s ease",
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Now Playing Card */}
      {currentPlaying && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 3,
              mb: 3,
              background: "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <VolumeIcon sx={{ fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Now Playing: {currentPlaying.title} - {currentPlaying.artist}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={duration ? (currentTime / duration) * 100 : 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "white",
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2">{formatTime(currentTime)}</Typography>
                <Typography variant="body2">{formatTime(duration)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Global Search Section */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
          🔍 Search Music Library
        </Typography>

        <Grid container spacing={2} alignItems="center">
          {/* Search Field Selector */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Search In</InputLabel>
              <Select value={searchField} label="Search In" onChange={(e) => setSearchField(e.target.value)}>
                <MenuItem value="all">All Fields</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="artist">Artist</MenuItem>
                <MenuItem value="album">Album</MenuItem>
                <MenuItem value="genre">Genre</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Global Search with Autocomplete */}
          <Grid item xs={12} sm={6} md={9}>
            <Autocomplete
              freeSolo
              options={getSearchSuggestions()}
              value={globalSearch}
              onInputChange={(event, newValue) => {
                setGlobalSearch(newValue || "")
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  placeholder={`Search ${searchField === "all" ? "all fields" : searchField}...`}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Search Results Summary */}
        {globalSearch && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Search: "${globalSearch}" in ${searchField === "all" ? "all fields" : searchField}`}
              onDelete={() => setGlobalSearch("")}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
          </Box>
        )}
      </Paper>

      {/* Filter, Sort, Group Controls */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
          <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Advanced Filters
        </Typography>

        <Grid container spacing={2} alignItems="center">
          {/* Filter Controls */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter By</InputLabel>
              <Select value={filterBy} label="Filter By" onChange={handleFilterByChange}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="artist">Artist</MenuItem>
                <MenuItem value="album">Album</MenuItem>
                <MenuItem value="genre">Genre</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={filterBy ? getUniqueValues(filterBy) : []}
              value={filterValue}
              onChange={(event, newValue) => {
                setFilterValue(newValue || "")
              }}
              onInputChange={(event, newValue) => {
                setFilterValue(newValue || "")
              }}
              disabled={!filterBy}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Filter Value"
                  placeholder={filterBy ? `Filter by ${filterBy}...` : "Select filter field first"}
                />
              )}
            />
          </Grid>

          {/* Sort Controls */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={handleSortByChange}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="artist">Artist</MenuItem>
                <MenuItem value="album">Album</MenuItem>
                <MenuItem value="genre">Genre</MenuItem>
                <MenuItem value="duration">Duration</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Order</InputLabel>
              <Select value={sortOrder} label="Order" onChange={handleSortOrderChange} disabled={!sortBy}>
                <MenuItem value="asc">A-Z</MenuItem>
                <MenuItem value="desc">Z-A</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Group Controls */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Group By</InputLabel>
              <Select value={groupBy} label="Group By" onChange={handleGroupByChange}>
                <MenuItem value="">None</MenuItem>
                <MenuItem value="artist">Artist</MenuItem>
                <MenuItem value="album">Album</MenuItem>
                <MenuItem value="genre">Genre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Results Summary and Clear Button */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Showing {Object.values(processedSongs()).reduce((total, group) => total + group.length, 0)} of{" "}
            {songs.length} songs
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearAll}
            sx={{
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Clear All
          </Button>
        </Box>

        {/* Debug Info - Remove in production */}
        {(globalSearch || filterBy || sortBy || groupBy) && (
          <Box sx={{ mt: 1, p: 2, bgcolor: "rgba(0,0,0,0.05)", borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Debug: Search="{globalSearch}" | Filter={filterBy}="{filterValue}" | Sort={sortBy}({sortOrder}) | Group=
              {groupBy}
            </Typography>
          </Box>
        )}

        {/* Active Filters Display */}
        {(globalSearch || filterBy || sortBy || groupBy) && (
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {globalSearch && (
              <Chip
                label={`Search: "${globalSearch}"`}
                onDelete={() => setGlobalSearch("")}
                color="info"
                variant="outlined"
                size="small"
              />
            )}
            {filterBy && (
              <Chip
                label={`Filter: ${filterBy} = "${filterValue}"`}
                onDelete={() => {
                  setFilterBy("")
                  setFilterValue("")
                }}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {sortBy && (
              <Chip
                label={`Sort: ${sortBy} (${sortOrder === "asc" ? "A-Z" : "Z-A"})`}
                onDelete={() => setSortBy("")}
                color="secondary"
                variant="outlined"
                size="small"
              />
            )}
            {groupBy && (
              <Chip
                label={`Group: ${groupBy}`}
                onDelete={() => setGroupBy("")}
                color="success"
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Songs Display */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: 4,
          p: 3,
          mb: 3,
        }}
      >
        {Object.entries(processedSongs()).map(([groupName, groupSongs]) => (
          <Box key={groupName} sx={{ mb: groupBy ? 3 : 0 }}>
            {groupBy && (
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <GroupIcon />
                {groupName} ({groupSongs.length} songs)
              </Typography>
            )}

            <Card
              elevation={6}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                mb: groupBy ? 2 : 0,
              }}
            >
              <List sx={{ p: 0 }}>
                <AnimatePresence>
                  {groupSongs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <ListItem
                        sx={{
                          borderBottom: index < groupSongs.length - 1 ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
                          py: 2.5,
                          px: 3,
                          background:
                            currentPlaying?.id === song.id
                              ? "rgba(102, 126, 234, 0.15)"
                              : index % 2 === 0
                                ? "rgba(255, 255, 255, 0.8)"
                                : "rgba(248, 249, 250, 0.6)",
                          "&:hover": {
                            backgroundColor: "rgba(102, 126, 234, 0.08)",
                            transform: "translateX(4px)",
                            transition: "all 0.3s ease",
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(index),
                            mr: 2,
                            width: 56,
                            height: 56,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          <AlbumIcon />
                        </Avatar>

                        <ListItemText
                          disableTypography
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                                {song.title}
                              </Typography>
                              <Chip
                                label={song.genre}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                  background:
                                    "linear-gradient(45deg, rgba(102, 126, 234, 0.1) 30%, rgba(118, 75, 162, 0.1) 90%)",
                                  borderColor: "rgba(102, 126, 234, 0.3)",
                                }}
                              />
                              {currentPlaying?.id === song.id && (
                                <Chip
                                  label={isPlaying ? "Playing" : "Paused"}
                                  size="small"
                                  color={isPlaying ? "success" : "warning"}
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography variant="body2" component="span" color="text.secondary">
                                  {song.artist}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  📀 {song.album}
                                </Typography>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  ⏱️ {song.duration}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />

                        <ListItemSecondaryAction>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            {/* Play/Pause Button - Available for all users */}
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton
                                edge="end"
                                aria-label={isPlaying && currentPlaying?.id === song.id ? "pause" : "play"}
                                onClick={() => handlePlayPause(song)}
                                sx={{
                                  color: "primary.main",
                                  background: "rgba(255, 255, 255, 0.8)",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                  "&:hover": {
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                                  },
                                }}
                              >
                                {isPlaying && currentPlaying?.id === song.id ? (
                                  <PauseIcon sx={{ fontSize: 24 }} />
                                ) : (
                                  <PlayIcon sx={{ fontSize: 24 }} />
                                )}
                              </IconButton>
                            </motion.div>

                            {/* Delete Button - Only for admin */}
                            {user?.role === "admin" && (
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDeleteClick(song)}
                                  sx={{
                                    color: "error.main",
                                    background: "rgba(255, 255, 255, 0.8)",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                    "&:hover": {
                                      backgroundColor: "error.main",
                                      color: "white",
                                      boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                                    },
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: 24 }} />
                                </IconButton>
                              </motion.div>
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </Card>
          </Box>
        ))}

        {/* No Results Message */}
        {Object.keys(processedSongs()).length === 0 ||
        Object.values(processedSongs()).every((group) => group.length === 0) ? (
          <Card
            elevation={4}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            }}
          >
            <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No songs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or filters, or add some songs to your library.
            </Typography>
          </Card>
        ) : null}
      </Box>

      {/* Add Button - Only for admin */}
      {user?.role === "admin" && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddSong}
            sx={{
              position: "fixed",
              bottom: isMobile ? 16 : 32,
              right: isMobile ? 16 : 32,
              background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
              },
            }}
          >
            <AddIcon />
          </Fab>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog - Only for admin */}
      {user?.role === "admin" && (
        <Dialog
          open={deleteDialog.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleDeleteCancel}
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: isMobile ? "90%" : "400px",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "error.main",
              fontWeight: "bold",
            }}
          >
            <DeleteIcon />
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete <strong>"{deleteDialog.songTitle}"</strong> from your music library? This
              action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleDeleteCancel} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ borderRadius: 2 }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add Song Dialog - Only for admin */}
      {user?.role === "admin" && (
        <Dialog
          open={addDialog.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleAddSongCancel}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: isMobile ? "90%" : "500px",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "primary.main",
              fontWeight: "bold",
            }}
          >
            <AddIcon />
            Add New Song
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  label="Song Title"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={handleFormChange("title")}
                  required
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Artist"
                  fullWidth
                  variant="outlined"
                  value={formData.artist}
                  onChange={handleFormChange("artist")}
                  required
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Album"
                  fullWidth
                  variant="outlined"
                  value={formData.album}
                  onChange={handleFormChange("album")}
                  required
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration (e.g., 3:45)"
                  fullWidth
                  variant="outlined"
                  value={formData.duration}
                  onChange={handleFormChange("duration")}
                  placeholder="0:00"
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Genre"
                  fullWidth
                  variant="outlined"
                  value={formData.genre}
                  onChange={handleFormChange("genre")}
                  placeholder="Rock, Pop, Jazz..."
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Audio URL"
                  fullWidth
                  variant="outlined"
                  value={formData.audioUrl}
                  onChange={handleFormChange("audioUrl")}
                  placeholder="https://example.com/song.mp3"
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleAddSongCancel} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSongSubmit}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #FF5252 30%, #26A69A 90%)",
                },
              }}
              disabled={!formData.title || !formData.artist || !formData.album}
            >
              Add Song
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  )
}

export default MusicLibrary
