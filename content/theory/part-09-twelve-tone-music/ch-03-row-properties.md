---
id: "twelve-tone-music.row-properties"
title: "Row Properties"
part_id: "twelve-tone-music"
part_title: "IX. Twelve-Tone Music"
part_order: 9
chapter_order: 3
slug: "row-properties"
key_takeaways:
  - "Some rows are used more by composers than others. Often this is because of the row's properties."
  - "This chapter explains some row properties that are especially common: all interval"
  - "derived rows"
  - "Invariance"
  - "Hexachordal combinatoriality"
  - "Partially-ordered sets"
  - "The Twelve-Tone Anthology has more detail on this topic."
glossary_terms:
  - "absolute"
  - "all-interval row"
  - "answer"
  - "chord"
  - "chromatic"
  - "chromatic scale"
  - "class"
  - "collection"
  - "comes"
  - "cycle"
  - "derived row"
  - "discrete"
  - "dynamics"
  - "final"
  - "foot"
---
> [!TIP] Key Takeaways
> - Some rows are used more by composers than others. Often this is because of the row's properties.
> - This chapter explains some row properties that are especially common: all interval
> - derived rows
> - Invariance
> - Hexachordal combinatoriality
> - Partially-ordered sets
> - The Twelve-Tone Anthology has more detail on this topic.

Twelve-tone composers may view the notes in a tone **row **as equal, but they do not appear to feel the same way about different **row forms**. Instead, rows with certain properties have disproportionately attracted composers’ attention. This chapter surveys some of the special types of properties and row forms to look out for. A recurring focus is on the properties of the smaller constituent parts of a row—its internal segments. There are two ways to view these constituent parts: overlapping and **discrete**.

# Overlapping Segments and the "All-Interval" Row

Considering every "overlapping" **segment** of a row means looking at segments starting at each pitch in turn. For instance, for dyads (two pitches, one interval), we look at pitches 1 and 2, then 2 and 3, followed by 3 and 4, and so on. By considering two pitches at a time and stepping forward by one, there’s always one pitch overlapping. That specific approach gives us the interval content of a row and allows us to identify our first notable row type: the **all-interval row**.

While all standard twelve-tone rows include all twelve distinct pitches, only some also feature all eleven distinct intervals between neighboring pitches (Example 1). There are 1,928 distinct row forms with this **all interval** property, but again, some of them have appealed to composers more than others. One true-by-definition property of these rows is that there is a tritone between each pair of notes around the central pair, i.e., between notes 1 and 12, 2 and 11, 3 and 10, 4 and 9, 5 and 8, and 6 and 7. In Example 1, for instance, the row starts with A and ends with D♯, and so on.

*

Example 1. An all-interval row from Luigi Nono, Il Canto Sospeso*.

This example of an all-interval row is a linear layout of the so-called "Grandmother chord" (credited to Nicolas Slonimsky). To produce this succession of pitches, start with a semitone up (interval class 1), then a tone down (interval class 10), and continue to alternate odd and even intervals with the odd intervals getting successively larger and the even ones smaller. As a consequence, the resulting pitch succession can be viewed as two interleaved chromatic scales (as shown in Example 1) which is essentially a chromatic wedge and can therefore be seen to have precedents in tonal works such as fugues by Bach (BWV 548) and Shostakovich (24 Preludes and Fugues, Op. 87, no. 15).[footnote]That the wedge is the subject of a fugue in both these cases, and therefore a central focus, recurring frequently throughout, perhaps strengthens the connection.[/footnote]

# Discrete Segments and "Derived" Rows

The alternative segmentation method is to look at the discrete (non-overlapping) parts of a row. This is perhaps the most common way of thinking about row forms. Given this constraint, a twelve-tone row can be divided into six dyads, four trichords, three tetrachords, or two hexachords. The fact that there are so many of these options is a property of the number 12 and one of the benefits of having a 12-based system.

In turning from overlapping to discrete segments, we also tend to turn our attention from considerations of "all" to "only." Specifically, it has been a preoccupation of some serial composers to find and use row forms featuring several instances of only one pitch class set.

Example 2 is a classic example from Anton Webern’s String Quartet, Op. 28. The brackets below the notes indicate the three discrete tetrachords belonging to the same **set class**: (0123), a chromatic tetrachord. Slurs above show a similar consistency in the discrete dyads, which are all semitones.

*﻿

Example 2. A row from Anton Webern's String Quartet Op. 28, divided into discrete segments. Notice the limited number of set classes and intervals.

Rows with this property are sometimes called **derived rows**, meaning that the whole row can be considered to be made out of ("derived" from) one pitch-class set. It’s worth also noting the more specific use of the term, where a new row with this property is derived more directly from an existing one with the relevant set as one of its subsegments. For instance, the row above might have been derived from another row that happened to have a (0123) subsegment in it.

From a compositional and listener-oriented perspective, derived rows are very suggestive. Because the set-class content of a row doesn’t change when it’s transposed, inverted, etc., these set classes will circulate constantly throughout a piece, even as different row forms are used. Therefore, a derived row guarantees the regular recurrence of set classes, which can be helpful in cultivating a particular type of unity.

# (Segmental) Invariance

**Invariance** refers to the preservation of something. Any musical attribute (such as a series of intervals, dynamics, rhythms, or pitches) may be kept the same from one context to another. While other parts of the music change, the aspect in question is not varied: hence the term "invariant." In twelve-tone theory, we are mostly concerned with intervallic invariance and pitch-class segmental invariance. The first type, intervallic invariance, is very common. Any time a row is transposed, the ordered intervallic content of the row is unchanged. (Likewise, retrograde inversion creates retrograde intervallic invariance.)

Segmental invariance is rarer and warrants separate comment here. Where a pitch-class segment of a row remains in place when that row is transformed, we say that the segment is “held invariant” (Example 3). The upper staff reproduces the row as we saw it in Example 2 (with the discrete tetrachords shown), and the lower staff sets out the same row transposed up four semitones (or, equivalently, down eight), i.e., as P4. Notice that these two different rows (P0 and P4) comprise the same tetrachords, not only in terms of set class, but in terms of absolute pitches:

 	
- The first four pitches of P0 (the first measure in the example) are the last four pitches of P4. This is shown in light blue.
 	
- The middle four pitches of P0 (the second measure in the example) are the first four pitches of P4. This is shown in red.
 	
- The last four pitches of P0 (the final measure in the example) are the middle four pitches of P4. This is shown in navy.

We say that these tetrachords are invariant segments.* These segments are held invariant because they share the same relationship with one another as that shared between the rows: because the tetrachords are related by T8, when the whole row is transposed by T8, those tetrachords are “held invariant.” Put another way, when the first tetrachord is transposed up four semitones, it *becomes* the last tetrachord, so the same thing happens when the whole row is transposed by that interval.

*

Example 3. Segmental invariance in Anton Webern's String Quartet Op. 28.

To determine when and if a pitch-class segment of a row will be held invariant:

 	
- Find an equivalent set-class elsewhere in the row. This may be a dyad, trichord, tetrachord, etc.
 	
- Determine the transpositional or inversional relationship between them.
 	
- When the row is transposed or inverted by that same* relationship a segment will be held invariant.

# Hexachords

While discussion of derived rows typically focuses on subsegments of three or four notes, the two discrete **hexachords** of a row (i.e., the two halves, pitches 1–6 and 7–12) have attracted at least as much attention from theorists and composers over the years, not least in terms of **hexachordal combinatoriality**.

## Hexachordal combinatoriality

For a standard twelve-tone row with each pitch stated exactly once, the first hexachord (half) of P0 **complements** the second half: they make up the total chromatic collection together. Since the first hexachord of R0 has the same pitches as the second hexachord of P0 by definition, we can also observe that the first hexachords of P0 and R0 are complementary—giving you the total chromatic collection. This illustrates that we can also find complementary hexachords by comparing two row forms.

By definition, this relation holds between P0 and R0, and all other P–R and I–RI pairs (e.g., I4-RI4). This "combinatoriality" relation becomes meaningful when it holds between rows related by other transformations, i.e., between a P–P, P–I, or P–RI pair. Using Milton Babbitt’s terminology, we distinguish between two degrees of this relation:

 	
- **Semi-combinatorial** pairs are related by one such transformation: transposition (P–P), inversion (P–I), or retrograde inversion (P–RI).
 	
- **All-combinatorial** pairs are related by each such serial transformation. There are only six distinct rows with this property where this relation holds between the row and transformations of itself. Repertoire examples include the row of Webern’s *Symphonie *(as explored further in [the next chapter](https://viva.pressbooks.pub/openmusictheory/chapter/twelve-tone-analysis-examples-webern-op-21-and-24/)).

## (014589): The "magic hexachord"

Just as the properties of some rows have attracted composers, so too have some hexachords. We’ll introduce just one "celebrity" hexachord here: set class (014589), the so-called "magic hexachord" (also known as the "**hexatonic collection**," "hexatonic set class," or "Ode-to-Napoleon hexachord"). This hexachord has the following properties:

 	
- Creates all-combinatorial rows unusually readily, for instance, by transposition in three ways (+/-2 and 6 semitones). Only the **whole-tone collection** (02468t) exceeds this, with combinatoriality by transposition of any odd-numbered interval.
 	
- Related to the 1:3 "distance model" mode discussed in the [Collections](https://viva.pressbooks.pub/openmusictheory/chapter/collections/) chapter.
 	
- Many internal triads: this set contains within it all the pitches of the hexatonic cycle discussed in the [neo-Riemannian](https://viva.pressbooks.pub/openmusictheory/chapter/neo-riemannian-triadic-progressions/) chapter.
 	
- Has only one possible five-note subset, set class (01458).
 	
- Has only one possible seven-note superset: (0124589), which is the complement of that five-note subset, (01458).
 	
- Used in many pieces, including Webern’s *Konzert* (as discussed in [the next chapter](https://viva.pressbooks.pub/openmusictheory/chapter/twelve-tone-analysis-examples-webern-op-21-and-24/)), Schoenberg’s *Ode to Napoleon *(hence one of its names), and works by Maderna and Nono.

# "Partially ordered" sets

When is "serial" music not really serial? Surprising as it might seem, the answer is "often." In the strict sense that twelve-tone music is supposed to be consistently based on a fixed succession of the twelve pitches in a simple (transposed and/or inverted) version of a referential row, much of what we call "serial" music doesn’t actually work like that.

A key example of this is the idea of a "partially ordered" set (another term borrowed from mathematics), which gives us a more flexible constraint than all twelve pitches being in a fixed order. Derived rows provide a good introduction to this situation. As we’ve seen, derived rows comprise one context in which we focus on the constituent segments (tetrachords, for instance) of a row and their set class. It’s a small step from this to a "row" that is defined more by the content of those segments than by any specific ordering.

Example 4 shows Webern’s Op. 28 row one more time (upper staff), and it creates a new row by reversing each pair of pitches (lower staff). The second case has the same dyadic and tetrachordal segments as the first, but the internal order of those segments has changed. By definition, we still have a row with all twelve pitches, but a different one.

*

Example 4. Partially re-ordered row created from Anton Webern's row in String Quartet, Op. 28.

We provide the Webern example for illustration; really, this is a concept introduced later, by Milton Babbitt, and the kinds of re-ordering can get a lot more complex. While this practice clearly deviates from the "strict" definition of twelve pitches in a fixed order, what they share is a constant turning over of the total chromatic collection (**aggregate**). Moreover, even in "strict" serialism, composers still use chords (several pitches sounding at once), which necessitates thinking more in the partially ordered sense than in the strictly serial sense. In short, at least some form of this thinking is very, very common indeed.

Finally, how significant is it for rows to be related by partial ordering? First, recall that there are hundreds of millions of different orderings of the twelve pitches. Well, there are fewer when you fix the hexachords in place (and fewer still for smaller subsegments), but still a lot! Here are some numbers:

 	
- Any ordering of the 12 pitches: [latex]12! = 490,001,600[/latex]
 	
- Hexachords fixed: [latex]6!×6! = 720^2 = 518,400[/latex]
 	
- Tetrachords fixed: [latex]4!×4!×4! = 24^3 = 13,824[/latex]
 	
- Trichords fixed: [latex]3!×3!×3!×3! = 6^4 = 1,296[/latex]
 	
- Dyads fixed: [latex]2!×2!×2!×2!×2!×2! = 2^6 = 64[/latex]

So this alone might be considered weak grounds for meaningful relation between row forms, especially as the interval content changes with each pitch permutation. As so often in analysis, it all comes down to how the composer actually uses the property in practice.

# Other Special Types of Row Forms

This chapter has surveyed only a few of the many row properties that composers have explored. We end simply with a short list of some others, as a nod to the huge range out there.

**Symmetrical interval progressions:** While a strictly symmetrical succession of pitches* is obviously not possible (given that we don’t repeat pitches within the row), a symmetrical succession of *intervals* is, and rows with this property are popular among some composers.

**"Cyclic series" rows** (George Perle): This term and property refer to rows in which the pairs of notes separated by one all form the same interval, i.e., the interval between pitches 1 and 3 is the same as that between 2 and 4, and so on.

**Rows with more or fewer than twelve notes:** Some composers have explored serial processes with tone rows longer or shorter than twelve notes. Clearly this leads to slightly different properties (e.g., repeating notes in the case of rows with more than twelve notes), but the compositional processes and priorities can be the same. And as we noted at the start of this section, "serial" thought is not limited to twelve-tone thinking anyway. Examples include:

Ruth Crawford Seeger, *Diaphonic Suite No. 1:*
7–9–8–11–0–5–1–7 (9 notes)

Ruth Crawford Seeger, String Quartet:
2–4–5–3–6–9–8–7–1–0 (10 notes)

Elizabeth Lutyens, *Requiescat In Memoriam Igor Stravinsky:*
6–8–4–2–11–0–3–1–5–7–10 (11 notes)

Elizabeth Lutyens, *Chamber Concerto*, Op. 8, no. 1, mvmt. I:
3–2–5–6–11–0–7–1–9–10–2–6–8–5–4 (15 notes)

Assignments

 	
- Head to the [Twelve-Tone Anthology](https://viva.pressbooks.pub/openmusictheory/chapter/anthology-twelve-tone/) and pick any row listed in the sections on derived rows (e.g., "6x Same Dyad (interval)" or "4x Same Trichord").

 	Write out the full row in musical notation.
 	
- Put slur lines over each repeated segment (e.g., 4 x 3 notes in the "4x Same Trichord").
 	
- Separately (e.g., below), write out those subsegments as chords.
