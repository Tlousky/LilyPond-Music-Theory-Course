# Overview
This course app is designed to teach both music theory and music notation, aimed at technical readers that feel more comfortable writing code than sketching notes in a notebook.
LilyPond is a markdown language for writing music notation using code and a readable, clear language.
The course will progressively cover music theory concepts and how to express them is music notation using LilyPond.

# Resources:
The source of the web based LilyPond editor, HackLily: https://github.com/jocelyn-stericker/hacklily
We'll be able to use it to create the course app, render notes, etc.

LilyPond documentation: https://lilypond.org/manuals.html

Open Music Theory textbook: https://viva.pressbooks.pub/openmusictheory/part/fundamentals/
Full ebook XML to be added to the uncommitted resources folder in this repo root.

LilyPond music notation classical music scores:
https://www.mutopiaproject.org/
https://baroquemusic.it/

# Approach
We'll follow the OMT textbook and add exercises to practice, play and generate notation.
In each new subject we'll learn the theory first then how to represent it with LilyPond interactively, 
with automatic testing and grading.

We'll track progress in a gamified manner similar to DuoLingo and other gamified education apps, with XP, levels and achievemnts.
Interactive exercises for rhythm and ear training and sight reading will be based on the LilyPond generated SVG and CSS3, as well as other modern accelerated interactive web frameworks.
We'll progressively also add real classical music examples for both music theory practice and LilyPond reconstruction using the syntax highlighted text editor.

# CodeGen research required
* While HackLily is OSS and provides an existing framework for both text editing and live score rendering,
we need to ensure it fits the other technical requirements for a fully featured learning app as this,
or if there's a need to rewrite the logic in a better fitting framework for the whole project.
* There's thought and planning required for how to gradually build the integrated music theory and LilyPond notation exercises.
* Some concepts can be learned together immediately, others need to be sequential (theory first, LilyPond after).
* We need to also explore playback capabilities. Again, there's a piano example in HackLily which probably uses MIDI and maybe a VST,
but we need to explore what would work for various PWA builds for PC, laptop and mobile devices.
* WE should probably start with locally storing the documentation for both LilyPond and the textbook,
converting it to agent usable MD files, then creating some sort of graph DB for easier access and connection using development.
