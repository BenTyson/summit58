---
description: Set a custom hero image for a peak
allowed-tools: Read, Edit, Bash(supabase db push:*), Bash(ls:*)
---

Set a custom hero image for a peak page.

## Arguments
- $1: peak slug (e.g., "longs-peak", "mt-massive") - optional
- $2: image filename (e.g., "Longs_Peak.jpg") - optional

## Instructions

1. If no arguments provided, list available images in `/static/images/peaks/` and show peaks that don't have custom images yet

2. If arguments provided:
   - Verify the image exists in `/static/images/peaks/$2`
   - Verify the peak slug exists by checking the migration files
   - Add an UPDATE statement to `supabase/migrations/20241227500000_custom_hero_images.sql`:
     ```sql
     -- Peak Name
     UPDATE peaks SET
       hero_image_url = '/images/peaks/$2',
       thumbnail_url = '/images/peaks/$2'
     WHERE slug = '$1';
     ```
   - Run `supabase db push` to apply

3. Confirm the change was made

## Image naming convention
Images should be named like: `Peak_Name.jpg` or `Peak_Name.png` (underscores for spaces)

## Example usage
```
/hero-image longs-peak Longs_Peak.jpg
/hero-image mt-massive Mt_Massive.png
/hero-image  # Lists available images and peaks without custom images
```
